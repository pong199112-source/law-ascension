import { expect, test, type Page } from "@playwright/test";

async function expectNoOverflow(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

async function addManual(
  page: Page,
  subject: string,
  activity: string,
  minutes: number,
  results?: { attempted: number; correct: number },
) {
  await page.getByRole("button", { name: "＋ เพิ่มเวลาเอง" }).click();
  await page.getByLabel("เลือกวิชา").selectOption(subject);
  await page.getByLabel("เลือกรูปแบบการเรียน").selectOption(activity);
  await page.getByLabel("เวลาที่เรียน (นาที)").fill(String(minutes));
  if (results) {
    await page.getByLabel("จำนวนข้อที่ทำ").fill(String(results.attempted));
    await page.getByLabel("จำนวนข้อที่ตอบถูก").fill(String(results.correct));
  }
  await page.getByRole("button", { name: /บันทึกเวลา ·/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("Home renders responsively and equipment appears on the supplied character", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto("/");
  await expect(page.locator(".main-character")).toHaveAttribute("src", /character-lv10-19-suit.webp/);
  await expect(page.locator(".accessory-layer")).toHaveAttribute("data-stage", "2");

  await page.getByRole("button", { name: "สวมแว่น", exact: true }).last().click();
  await expect(page.locator('[data-equipment-overlay="glasses"]')).toHaveCount(1);
  await expect(page.getByRole("button", { name: "ถอดแว่น", exact: true })).toHaveCount(2);
  const suitAnchor = await page.locator('[data-equipment-overlay="glasses"]').getAttribute("style");

  await page.getByRole("button", { name: "เสื้อยืดธรรมดา ปลดล็อกแล้ว" }).click();
  await page.getByRole("button", { name: "ใช้ชุดนี้", exact: true }).click();
  await expect(page.locator(".accessory-layer")).toHaveAttribute("data-stage", "1");
  await expect(page.locator('[data-equipment-overlay="glasses"]')).toHaveCount(1);
  expect(await page.locator('[data-equipment-overlay="glasses"]').getAttribute("style")).not.toBe(suitAnchor);

  await page.getByRole("button", { name: "ถอดแว่น", exact: true }).last().click();
  await expect(page.locator('[data-equipment-overlay="glasses"]')).toHaveCount(0);
  await page.getByRole("button", { name: "สวมแว่น", exact: true }).last().click();
  await page.getByRole("button", { name: "สวมนาฬิกา", exact: true }).last().click();
  await page.getByRole("button", { name: "สวมID card", exact: true }).last().click();
  await page.getByRole("button", { name: "อัตโนมัติ ปิด", exact: true }).click();
  await expect(page.locator(".accessory-layer")).toHaveAttribute("data-stage", "2");

  for (const [width, height] of [[1440, 1080], [1024, 900], [768, 900], [390, 844], [320, 760]]) {
    await expectNoOverflow(page, width, height);
    if (width === 1440) await page.screenshot({ path: "docs/screenshots/desktop.png", fullPage: true });
    if (width === 390) {
      const hero = await page.locator(".character-panel").boundingBox();
      const subjects = await page.locator(".subjects-panel").boundingBox();
      expect(hero!.y).toBeLessThan(subjects!.y);
      await page.screenshot({ path: "docs/screenshots/mobile.png", fullPage: true });
      await page.screenshot({ path: "docs/screenshots/mobile-viewport.png" });
    }
  }
  expect(errors).toEqual([]);
});

test("manual activity records real minutes, 85 percent XP, subject XP and question accuracy", async ({ page }) => {
  await page.goto("/");
  await addManual(page, "civil-procedure", "questions", 30, { attempted: 28, correct: 22 });
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "671");
  await expect(page.getByRole("progressbar", { name: "วิแพ่ง XP" })).toHaveAttribute("aria-valuenow", "701");
  await expect(page.getByRole("progressbar", { name: "ทำข้อสอบ mission" })).toHaveAttribute("aria-valuenow", "30");
  await expect(page.locator(".daily-reward")).toContainText("วันนี้เรียนแล้ว 30 นาที");
  await page.getByRole("button", { name: "◷ ดูประวัติ" }).click();
  await expect(page.locator(".history-list")).toContainText("วิแพ่ง · ทำข้อสอบ");
  await expect(page.locator(".history-list")).toContainText("28 ข้อ · ถูก 22 · Accuracy 79%");
  await expect(page.locator(".history-list")).toContainText("+21 XP");
});

test("timer awards 30 and 60 minute checkpoints without double counting on finish", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.locator(".start-button").click();
  await page.getByLabel("เลือกรูปแบบการเรียน").selectOption("reading");
  await page.getByRole("button", { name: "▶ เริ่มจับเวลา" }).click();
  await page.clock.fastForward(30 * 60 * 1000 + 500);
  await expect(page.getByRole("progressbar", { name: "อ่านเนื้อหา mission" })).toHaveAttribute("aria-valuenow", "30");
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "670");
  await page.clock.fastForward(30 * 60 * 1000);
  await expect(page.getByRole("progressbar", { name: "อ่านเนื้อหา mission" })).toHaveAttribute("aria-valuenow", "60");
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "690");
  await page.getByRole("button", { name: "จบ Session และบันทึก 60 นาที" }).click();
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "690");
  await page.getByRole("button", { name: "◷ ดูประวัติ" }).click();
  await expect(page.locator(".history-list")).toContainText("60 นาที");
  await expect(page.locator(".history-list")).toContainText("+40 XP");
});

test("47 minute timer keeps partial time and XP", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.locator(".start-button").click();
  await page.getByRole("button", { name: "▶ เริ่มจับเวลา" }).click();
  await page.clock.fastForward(47 * 60 * 1000 + 500);
  await page.getByRole("button", { name: "จบ Session และบันทึก 47 นาที" }).click();
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "679");
  await expect(page.getByRole("progressbar", { name: "อ่านเนื้อหา mission" })).toHaveAttribute("aria-valuenow", "47");
  await page.getByRole("button", { name: "◷ ดูประวัติ" }).click();
  await expect(page.locator(".history-list")).toContainText("47 นาที");
  await expect(page.locator(".history-list")).toContainText("+29 XP");
});

test("a 30 minute question session is a complete checkpoint with optional accuracy", async ({ page }) => {
  await page.clock.install();
  await page.goto("/");
  await page.locator(".start-button").click();
  await page.getByLabel("เลือกรูปแบบการเรียน").selectOption("questions");
  await page.getByLabel("จำนวนข้อที่ทำ").fill("28");
  await page.getByLabel("จำนวนข้อที่ตอบถูก").fill("22");
  await page.getByRole("button", { name: "▶ เริ่มจับเวลา" }).click();
  await page.clock.fastForward(30 * 60 * 1000 + 500);
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "675");
  await page.getByRole("button", { name: "จบ Session และบันทึก 30 นาที" }).click();
  await page.getByRole("button", { name: "◷ ดูประวัติ" }).click();
  await expect(page.locator(".history-list")).toContainText("28 ข้อ · ถูก 22 · Accuracy 79%");
  await expect(page.locator(".history-list")).toContainText("+25 XP");
});

test("daily completion bonus is granted once", async ({ page }) => {
  await page.goto("/");
  await addManual(page, "civil", "reading", 240);
  await addManual(page, "civil", "questions", 30);
  await addManual(page, "civil", "summary", 30);
  await addManual(page, "civil", "lecture", 30);
  await expect(page.locator(".quest-count")).toHaveText("4/4");
  await expect(page.locator(".daily-reward")).toContainText("รับโบนัสครบทุกกิจกรรมแล้ว +30 Overall XP");
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "865");
  await addManual(page, "civil", "lecture", 30);
  await expect(page.getByRole("progressbar", { name: "Overall XP" })).toHaveAttribute("aria-valuenow", "880");
});
