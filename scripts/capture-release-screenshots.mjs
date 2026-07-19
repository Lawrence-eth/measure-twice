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
const storageKey = "pentimento-studio-v4";

const emptyMirror = {
  person: "",
  situation: "",
  usefulResult: "",
  completePath: "",
  trustedFacts: "",
  mustHave: "",
  notNow: "",
  doneWhen: "",
  toolRoute: "",
};

const baseProgress = {
  version: 4,
  started: true,
  stage: "tools",
  completedStages: ["idea"],
  ideaChoice: "facts-email",
  toolChoice: null,
  projectHomeChoice: null,
  secretChoice: null,
  aiFirstChoice: null,
  planApprovalChoice: null,
  buildEvidenceChoice: null,
  checkAttemptChoice: null,
  repairChoice: null,
  checkRetryChoice: null,
  releaseVersionChoice: null,
  releaseProofChoice: null,
  improveChoice: null,
  toolDecoderOpen: false,
  playbookOpen: false,
  activePlaybookCard: null,
  mirrorOpen: false,
  mirrorStep: 1,
  mirrorDraft: emptyMirror,
  finished: false,
};

const completedProgress = {
  ...baseProgress,
  stage: "completion",
  completedStages: [
    "idea",
    "tools",
    "project-home",
    "ask-ai",
    "build",
    "check",
    "go-live",
    "improve",
  ],
  toolChoice: "repository",
  projectHomeChoice: "route-home",
  secretChoice: "private-env",
  aiFirstChoice: "inspect-plan",
  planApprovalChoice: "approve-step-one",
  buildEvidenceChoice: "full-evidence",
  checkAttemptChoice: "try-contact",
  repairChoice: "bounded-repair",
  checkRetryChoice: "retry-contact",
  releaseVersionChoice: "v4-checked",
  releaseProofChoice: "public-path",
  improveChoice: "source-then-page",
  finished: true,
};

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
}

async function newPage(browser, viewport, progress = null) {
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
      name: /Learn to build with AI.*One clear step at a time/i,
    })
    .waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `studio-welcome${suffix}.png`),
    fullPage: false,
  });

  await page
    .getByRole("button", { name: "Preview how the lesson works" })
    .click();
  await page.getByRole("dialog", { name: "How the lesson works" }).waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `tool-map${suffix}.png`),
    fullPage: false,
  });
  await context.close();
}

async function captureToolChoice(browser, suffix, viewport) {
  const { context, page } = await newPage(browser, viewport, baseProgress);
  await page.goto(baseUrl);
  await page.getByRole("button", { name: "Resume at Tools" }).click();
  await page.getByRole("heading", { level: 1, name: "Give each tool one job" }).waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `tool-choice${suffix}.png`),
    fullPage: false,
  });
  await context.close();
}

async function captureCompletion(browser, suffix, viewport) {
  const { context, page } = await newPage(browser, viewport, completedProgress);
  await page.goto(baseUrl);
  await page
    .getByRole("heading", {
      level: 1,
      name: /You can guide.*a project from idea to evidence/i,
    })
    .waitFor();
  await settle(page);
  await page.screenshot({
    path: path.join(outputDirectory, `completed-playbook${suffix}.png`),
    fullPage: false,
  });

  if (!suffix) {
    await page.getByRole("button", { name: "Shape my own V1 brief" }).click();
    await page.getByLabel("Who is this for?").fill("A first-time community event visitor");
    await page.getByLabel("What situation are they in?").fill("Deciding from a phone whether the event fits their item");
    await page.getByLabel("What useful result should they get?").fill("Confirm the facts and email one question");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("What complete path should they finish?").fill("Open the page → compare approved details → email the organizer");
    await page.getByLabel("What facts can you trust?").fill("The organizer-approved event note");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("What must the first version include?").fill("Date, place, item list, and a working contact path");
    await page.getByLabel("What is not now?").fill("Accounts, booking, payments, and live availability");
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByLabel("What proves it is done?").fill("Another person completes the path at 390px and by keyboard");
    await page.getByRole("button", { name: "Create my V1 brief" }).click();
    await page.getByRole("heading", { name: "V1 brief ready" }).waitFor();
    await settle(page);
    await page.getByRole("dialog", { name: "Teaching Mirror" }).screenshot({
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

console.log(`Captured Pentimento v4 release screenshots from ${baseUrl}`);
