import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl =
  process.env.SCREENSHOT_BASE_URL ?? "https://pentimento.aethe.me";
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputDirectory = path.join(repositoryRoot, "docs", "screenshots");
const storageKey = "pentimento-studio-v3";

const initialProgress = {
  version: 3,
  started: true,
  stage: "tools",
  completedStages: ["idea"],
  revealPercent: 52,
  featureDecisions: {
    "Event facts and accepted-item list": "now",
    "Email link": "now",
    "Booking system": "later",
    "Volunteer accounts": "later",
    Donations: "later",
    "AI repair advice": "later",
  },
  ideaStep: 6,
  toolLane: null,
  foundationStep: 0,
  promptParts: [],
  planApproved: false,
  buildCycle: 0,
  buildPhase: "ask",
  checksRun: [],
  repairPrepared: false,
  repairApplied: false,
  versionFocus: 0,
  releaseStep: 0,
  improveStep: 0,
  mirrorDraft: {
    person: "",
    situation: "",
    usefulResult: "",
    completePath: "",
    trustedFacts: "",
    mustHave: "",
    notNow: "",
    doneWhen: "",
  },
  finished: false,
};

const completedProgress = {
  ...initialProgress,
  stage: "playbook",
  completedStages: [
    "idea",
    "tools",
    "home",
    "ask",
    "build",
    "check",
    "live",
    "improve",
  ],
  toolLane: "repository",
  foundationStep: 5,
  promptParts: ["purpose", "truth", "limits", "mode", "done"],
  planApproved: true,
  buildCycle: 3,
  checksRun: [
    "unsupported-promise",
    "clipped-contact",
    "inactive-email",
  ],
  repairPrepared: true,
  repairApplied: true,
  versionFocus: 4,
  releaseStep: 5,
  improveStep: 4,
  finished: true,
};

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

async function prepareLongCapture(page) {
  await page.addStyleTag({
    content: `
      .skip-link { display: none !important; }
      .studio-header--journey,
      .route-nav { position: relative !important; top: auto !important; }
    `,
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
  await page.waitForTimeout(100);
}

async function newPage(browser, viewport, progress) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce",
  });

  await context.addInitScript(
    ({ key, value }) => {
      window.localStorage.removeItem(key);
      window.sessionStorage.clear();
      if (value) window.localStorage.setItem(key, JSON.stringify(value));
    },
    { key: storageKey, value: progress },
  );

  return { context, page: await context.newPage() };
}

async function captureOpening(browser, suffix, viewport) {
  const { context, page } = await newPage(browser, viewport);
  await page.goto(baseUrl);
  await page
    .getByRole("heading", {
      level: 1,
      name: /Build your first project with AI.*from idea to live link/i,
    })
    .waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `studio-welcome${suffix}.png`),
    fullPage: true,
  });

  await page.getByRole("button", { name: /Show me the route/i }).click();
  await page
    .getByRole("heading", {
      level: 1,
      name: /Most first projects need three roles.*not twenty tools/i,
    })
    .waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `tool-map${suffix}.png`),
    fullPage: true,
  });
  await context.close();
}

async function captureToolChoice(browser, suffix, viewport) {
  const { context, page } = await newPage(browser, viewport, initialProgress);
  await page.goto(baseUrl);
  await page
    .getByRole("button", { name: "Resume where I left off" })
    .click();
  await page
    .getByRole("heading", {
      level: 1,
      name: "Choose a sensible place to start",
    })
    .waitFor();
  await page.locator(".tool-name-decoder > summary").click();
  await page
    .locator(".lane-card")
    .filter({ hasText: "Most transferable" })
    .getByRole("button")
    .click();
  await settle(page);
  await prepareLongCapture(page);
  await page.screenshot({
    path: path.join(outputDirectory, `tool-choice${suffix}.png`),
    fullPage: true,
  });
  await context.close();
}

async function captureCompletion(browser, suffix, viewport) {
  const { context, page } = await newPage(browser, viewport, completedProgress);
  await page.goto(baseUrl);
  await page
    .getByRole("button", { name: "Resume where I left off" })
    .click();
  await page
    .getByRole("heading", {
      level: 1,
      name: /You now know where to start/i,
    })
    .waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `completed-playbook${suffix}.png`),
    fullPage: false,
  });

  if (!suffix) {
    await page.locator(".teaching-mirror > summary").click();
    await page.getByRole("button", { name: "Load a tiny example" }).click();
    await page
      .getByRole("button", { name: "Ask the Teaching Mirror" })
      .click();
    await page.locator(".mirror-result").waitFor();
    await settle(page);
    await prepareLongCapture(page);
    await page.locator(".teaching-mirror").screenshot({
      path: path.join(outputDirectory, "teaching-mirror.png"),
    });
  }

  await context.close();
}

await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch();

try {
  for (const target of [
    { suffix: "", viewport: { width: 1440, height: 1000 } },
    { suffix: "-mobile", viewport: { width: 390, height: 844 } },
  ]) {
    await captureOpening(browser, target.suffix, target.viewport);
    await captureToolChoice(browser, target.suffix, target.viewport);
    await captureCompletion(browser, target.suffix, target.viewport);
  }
} finally {
  await browser.close();
}

console.log(`Captured Pentimento release screenshots from ${baseUrl}`);
