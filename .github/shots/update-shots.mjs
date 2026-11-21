// Takes a fresh screenshot of every live project and replaces media/shots/<file>.webp
// only when the site really looks different. Broken / blank pages never replace a photo.
// Run: node update-shots.mjs            (all sites)
//      node update-shots.mjs drama kyvro (only these)
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.env.SHOTS_DIR || path.resolve(here, "../../media/shots");
const CHANGE = Number(process.env.SHOTS_CHANGE || 6); // avg pixel change (0-255) needed to replace
const { sites } = JSON.parse(await fs.readFile(path.join(here, "sites.json"), "utf8"));
const only = process.argv.slice(2);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tiny = (buf) => sharp(buf).resize(96, 60, { fit: "fill" }).greyscale().raw().toBuffer();

async function capture(browser, s) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, colorScheme: "dark" });
  const page = await ctx.newPage();
  try {
    const res = await page.goto(s.url, { waitUntil: "load", timeout: 60000 });
    if (!res || res.status() >= 400) throw new Error("HTTP " + (res && res.status()));
    await page.waitForLoadState("networkidle", { timeout: 20000 }).catch(() => {});
    await sleep(s.wait || 3500);
    for (const a of s.actions || []) {
      if (a.press) await page.keyboard.press(a.press);
      if (a.click) await page.click(a.click, { timeout: 5000 }).catch(() => {});
      if (a.clickAt) await page.mouse.click(a.clickAt[0], a.clickAt[1]);
      if (a.hide) await page.addStyleTag({ content: a.hide + "{display:none!important}" });
      await sleep(a.wait || 800);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(500);
    return await page.screenshot({ type: "png" });
  } finally {
    await ctx.close();
  }
}

const browser = await chromium.launch(process.env.SHOTS_CHROME ? { channel: process.env.SHOTS_CHROME } : {});
const report = [];
for (const s of sites) {
  if (only.length ? !only.includes(s.file) : s.skip) continue;
  const file = path.join(OUT, s.file + ".webp");
  try {
    const png = await capture(browser, s);
    const st = await sharp(png).stats();
    if (Math.max(...st.channels.slice(0, 3).map((c) => c.stdev)) < 10) { report.push([s.file, "skipped: page looks blank"]); continue; }
    const webp = await sharp(png).resize(960, 600).webp({ quality: 86 }).toBuffer();
    let diff = 255;
    try {
      const [a, b] = await Promise.all([tiny(await fs.readFile(file)), tiny(webp)]);
      diff = a.reduce((t, v, i) => t + Math.abs(v - b[i]), 0) / a.length;
    } catch {}
    if (diff < (s.change || CHANGE)) { report.push([s.file, "same (" + diff.toFixed(1) + ")"]); continue; }
    await fs.writeFile(file, webp);
    report.push([s.file, "UPDATED (" + diff.toFixed(1) + ")"]);
  } catch (e) {
    report.push([s.file, "skipped: " + e.message.split("\n")[0]]);
  }
}
await browser.close();
for (const [f, r] of report) console.log(f.padEnd(16), r);
