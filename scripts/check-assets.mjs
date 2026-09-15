import { readFile, access } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(
  await readFile(
    new URL("public/assets/characters/manifest.json", root),
    "utf8",
  ),
);
const expected = [
  ...manifest.stages.map((stage) => `public${stage.file}`),
  "design-reference/dashboard-reference.webp",
  "design-reference/dashboard-reference-alt.webp",
];
const missing = [];
for (const file of expected) {
  try {
    await access(new URL(file, root));
  } catch {
    missing.push(file);
  }
}
if (missing.length) {
  console.error("Approved assets missing:\n" + missing.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    "All six character assets and both design references are present.",
  );
}
