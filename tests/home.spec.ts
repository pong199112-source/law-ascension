import { test, expect } from "@playwright/test";

test("desktop and mobile: approved art, responsive layout, and real reading interactions", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      errors.push(`${message.text()} ${message.location().url}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width > 640 ? 1080 : 844 });
    await page.goto("/");
    await expect(page.locator(".main-character")).toHaveAttribute(
      "src",
      /character-lv10-19-suit.webp/,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".items").scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll((images) =>
            images.every((image) => image.complete && image.naturalWidth > 0),
          ),
      )
      .toBe(true);
    const overflow = await page
      .locator("body *")
      .evaluateAll((elements) =>
        elements
          .filter(
            (element) =>
              element.getBoundingClientRect().right > window.innerWidth &&
              !element.closest(".stages"),
          )
          .map((element) => ({
            element: element.className,
            right: element.getBoundingClientRect().right,
          })),
      );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `No horizontal page overflow at ${width}px: ${JSON.stringify(overflow)}`,
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `docs/screenshots/${width === 1440 ? "desktop" : "mobile"}.png`,
        fullPage: true,
      });
    if (width === 390)
      await page.screenshot({ path: "docs/screenshots/mobile-viewport.png" });
    if (width === 390) {
      const hero = await page.locator(".character-panel").boundingBox();
      const subjects = await page.locator(".subjects-panel").boundingBox();
      expect(hero!.y).toBeLessThan(subjects!.y);
      expect(
        await page
          .locator(".stages")
          .evaluate((element) => element.scrollWidth > element.clientWidth),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.getByRole("button", { name: "＋ เพิ่มเวลาเอง" }).click();
  await page.getByLabel("เวลาที่อ่าน (นาที)").fill("0");
  await page.getByRole("button", { name: /บันทึกเวลาอ่าน/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("เวลาที่อ่าน (นาที)").fill("240");
  await page.getByRole("button", { name: /บันทึกเวลาอ่าน/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".main-character")).toHaveAttribute(
    "src",
    /character-lv20-29-khaki.webp/,
  );
  await expect(
    page.getByRole("progressbar", { name: "Overall XP", exact: true }),
  ).toHaveAttribute("aria-valuenow", "50");
  await expect(page.locator(".quest-count")).toHaveText("2/5");
  await page.getByRole("button", { name: "◷ ดูประวัติ" }).click();
  await expect(page.locator(".history-list li")).toHaveCount(1);
  await expect(page.locator(".history-list")).toContainText("240 นาที");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "ชุดปกติขาว ยังไม่ปลดล็อก" }).click();
  await expect(page.getByRole("dialog")).toContainText("ปลดล็อกเมื่อถึง Lv.50");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "👓 แว่น" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "ยังไม่มีโบนัสหรือระบบสวมใส่",
  );
  await page.keyboard.press("Escape");
  await page.clock.install();
  await page.locator(".start-button").click();
  await page
    .getByRole("button", { name: "▶ เริ่มจับเวลา", exact: true })
    .click();
  await page.clock.fastForward(65000);
  await page.getByRole("button", { name: "Ⅱ พักสักครู่", exact: true }).click();
  await expect(page.locator(".timer-display")).toHaveText("01:05");
  await page.clock.fastForward(30000);
  await expect(page.locator(".timer-display")).toHaveText("01:05");
  await page.getByRole("button", { name: "▶ อ่านต่อ", exact: true }).click();
  await page.clock.fastForward(60000);
  await page
    .getByRole("button", { name: "จบการอ่านและบันทึก 2 นาที", exact: true })
    .click();
  await expect(
    page.getByRole("progressbar", { name: "Overall XP", exact: true }),
  ).toHaveAttribute("aria-valuenow", "70");
  await page.reload();
  await expect(page.locator(".main-character")).toHaveAttribute(
    "src",
    /character-lv10-19-suit.webp/,
  );
  expect(errors).toEqual([]);
});

test.describe("mobile touch interactions", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  test("manual entry, completed quests, collection and modal keyboard dismissal", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "＋ เพิ่มเวลาเอง" }).tap();
    await page.getByLabel("วิชาที่อ่าน").selectOption("civil");
    await page.getByRole("button", { name: "30 นาที", exact: true }).tap();
    await page.getByRole("button", { name: /บันทึกเวลาอ่าน/ }).tap();
    await expect(page.locator(".quest-count")).toHaveText("1/5");
    await expect(
      page.getByRole("progressbar", { name: "แพ่ง XP", exact: true }),
    ).toHaveAttribute("aria-valuenow", "150");
    await page
      .locator(".sidebar")
      .getByRole("link", { name: "♧ ตัวละคร" })
      .tap();
    await page.locator(".stages").evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await page.getByRole("button", { name: "ชุดปกติขาว ยังไม่ปลดล็อก" }).tap();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "ปิด", exact: true }).tap();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
