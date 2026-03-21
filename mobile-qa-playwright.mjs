import { chromium, firefox, webkit } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.argv[2] || "http://localhost:3000/kanchenjunga-circuit-trek.html";
const OUT_DIR = path.resolve("qa-artifacts");

const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "412x915", width: 412, height: 915 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x1366", width: 1024, height: 1366 },
  { name: "1440x900", width: 1440, height: 900 }
];

const screenshotViewports = new Set(["320x568", "390x844", "768x1024", "1440x900"]);

async function safeClick(page, selector) {
  const el = page.locator(selector).first();
  if (await el.count()) {
    await el.scrollIntoViewIfNeeded();
    await el.click({ timeout: 5000 });
    return true;
  }
  return false;
}

async function runEngine(engineName, browserType) {
  const results = [];
  const browser = await browserType.launch({ headless: true });

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const row = {
        engine: engineName,
        viewport: vp.name,
        horizontalScroll: "FAIL",
        heroVisible: "FAIL",
        mobileMenu: "N/A",
        itinerary: "FAIL",
        faq: "FAIL",
        highlightsToggle: "FAIL",
        stickyBar: "FAIL",
        galleryLoaded: "FAIL"
      };

      try {
        await page.goto(BASE_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(700);

        try {
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
          });
          row.horizontalScroll = hasHorizontalScroll ? "FAIL" : "PASS";
        } catch {}

        try {
          const heroVisible = await page.locator(".pkg-hero .pkg-hero-content h1").first().isVisible();
          const ctaVisible = await page.locator(".pkg-hero .btn-primary").first().isVisible();
          row.heroVisible = heroVisible && ctaVisible ? "PASS" : "FAIL";
        } catch {}

        const isMobile = vp.width <= 768;
        if (isMobile) {
          try {
            const opened = await safeClick(page, "#hamburger");
            if (opened) {
              await page.waitForTimeout(400);
              const linkVisible = await page.locator("#mobileMenu .mobile-links li a").first().isVisible();
              row.mobileMenu = linkVisible ? "PASS" : "FAIL";
              // Close overlay before continuing other interactions.
              await safeClick(page, "#hamburger");
              await page.waitForTimeout(250);
            } else {
              row.mobileMenu = "FAIL";
            }
          } catch {}
        }

        try {
          const itiOpened = await safeClick(page, ".iti-item:nth-child(2) .iti-header");
          if (itiOpened) {
            await page.waitForTimeout(200);
            const isActive = await page.locator(".iti-item:nth-child(2)").evaluate((el) => el.classList.contains("active"));
            row.itinerary = isActive ? "PASS" : "FAIL";
          }
        } catch {}

        try {
          const faqOpened = await safeClick(page, ".faq-item .faq-question");
          if (faqOpened) {
            await page.waitForTimeout(200);
            const faqActive = await page.locator(".faq-item").first().evaluate((el) => el.classList.contains("active"));
            row.faq = faqActive ? "PASS" : "FAIL";
          }
        } catch {}

        try {
          const seeMoreButton = page.locator("#btnSeeMore");
          if (await seeMoreButton.count()) {
            await seeMoreButton.click();
            await page.waitForTimeout(250);
            const extraVisible = await page.locator(".extra-highlight").first().isVisible();
            row.highlightsToggle = extraVisible ? "PASS" : "FAIL";
          }
        } catch {}

        try {
          await page.evaluate(() => window.scrollTo(0, 1800));
          await page.waitForTimeout(300);
          const stickyShown = await page.locator("#stickyBooking").evaluate((el) => el.classList.contains("show"));
          const stickyBtn = await page.locator("#stickyBooking .btn-primary").first().isVisible();
          row.stickyBar = stickyShown && stickyBtn ? "PASS" : "FAIL";
        } catch {}

        try {
          const galleryCount = await page.locator(".gallery-grid img").count();
          row.galleryLoaded = galleryCount >= 4 ? "PASS" : "FAIL";
        } catch {}

      } catch {
        // keep FAIL defaults
      } finally {
        if (screenshotViewports.has(vp.name)) {
          try {
            const shotPath = path.join(OUT_DIR, `${engineName}-${vp.name}.png`);
            await page.screenshot({ path: shotPath, fullPage: true });
          } catch {}
        }
        results.push(row);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  return results;
}

function renderSummary(rows) {
  const headers = [
    "engine", "viewport", "horizontalScroll", "heroVisible", "mobileMenu",
    "itinerary", "faq", "highlightsToggle", "stickyBar", "galleryLoaded"
  ];
  const line = headers.join(",");
  const body = rows.map((r) => headers.map((h) => r[h]).join(",")).join("\n");
  return `${line}\n${body}\n`;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const all = [];

  const engines = [
    { name: "chromium", type: chromium },
    { name: "firefox", type: firefox },
    { name: "webkit", type: webkit }
  ];

  for (const e of engines) {
    try {
      const rows = await runEngine(e.name, e.type);
      all.push(...rows);
    } catch {
      all.push({
        engine: e.name,
        viewport: "engine-unavailable",
        horizontalScroll: "FAIL",
        heroVisible: "FAIL",
        mobileMenu: "N/A",
        itinerary: "FAIL",
        faq: "FAIL",
        highlightsToggle: "FAIL",
        stickyBar: "FAIL",
        galleryLoaded: "FAIL"
      });
    }
  }

  const csv = renderSummary(all);
  await fs.writeFile(path.join(OUT_DIR, "mobile-qa-results.csv"), csv, "utf8");
  console.log(csv);
  console.log(`Artifacts: ${OUT_DIR}`);
}

await main();
