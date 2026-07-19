import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// Example:
// AUDIT_BASE_URL=http://127.0.0.1:3000 AUDIT_SUMMARY_ONLY=1 \
//   AUDIT_TARGET=mobile \
//   AUDIT_SCREENSHOT_DIR=/tmp/pentimento-v5-audit \
//   node scripts/audit-experience-density.mjs
// Set AUDIT_FAIL_ON_THRESHOLDS=1 when the four interaction-density gates should
// make this command exit non-zero.
const baseUrl =
  process.env.AUDIT_BASE_URL ?? "https://pentimento.law-ender.chatgpt.site";
const screenshotDirectory = process.env.AUDIT_SCREENSHOT_DIR;
const screenshotFullPage = process.env.AUDIT_SCREENSHOT_FULL_PAGE === "1";
const summaryOnly = process.env.AUDIT_SUMMARY_ONLY === "1";
const failOnThresholds = process.env.AUDIT_FAIL_ON_THRESHOLDS === "1";
const requestedTarget = process.env.AUDIT_TARGET;
const storageKey = "pentimento-studio-v4";

const learningStages = [
  "idea",
  "tools",
  "project-home",
  "ask-ai",
  "build",
  "check",
  "go-live",
  "improve",
];

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
  stage: "idea",
  completedStages: [],
  ideaChoice: null,
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

const completionChoices = {
  idea: { ideaChoice: "facts-email" },
  tools: { toolChoice: "repository" },
  "project-home": {
    projectHomeChoice: "route-home",
    secretChoice: "private-env",
  },
  "ask-ai": {
    aiFirstChoice: "inspect-plan",
    planApprovalChoice: "approve-step-one",
  },
  build: { buildEvidenceChoice: "full-evidence" },
  check: {
    checkAttemptChoice: "try-contact",
    repairChoice: "bounded-repair",
    checkRetryChoice: "retry-contact",
  },
  "go-live": {
    releaseVersionChoice: "v4-checked",
    releaseProofChoice: "public-path",
  },
  improve: { improveChoice: "source-then-page" },
};

function progressAt(stage, patch = {}) {
  if (stage === "welcome") {
    return {
      ...baseProgress,
      started: false,
      stage: "welcome",
      mirrorDraft: { ...emptyMirror },
      ...patch,
    };
  }

  const completedCount =
    stage === "completion" ? learningStages.length : learningStages.indexOf(stage);
  if (completedCount < 0) throw new Error(`Unknown v4 stage: ${stage}`);

  const completedStages = learningStages.slice(0, completedCount);
  const prerequisiteChoices = Object.assign(
    {},
    ...completedStages.map((completedStage) => completionChoices[completedStage]),
  );

  return {
    ...baseProgress,
    stage,
    completedStages,
    ...prerequisiteChoices,
    mirrorDraft: { ...emptyMirror },
    finished: stage === "completion",
    ...patch,
  };
}

const coreTask = {
  taskSelector: ".p4-task",
  actionSelector: ".p4-task button:not([disabled])",
};

const scenarios = [
  {
    name: "welcome",
    group: "core",
    progress: progressAt("welcome"),
    taskSelector: ".p4-welcome__copy",
    actionSelector: ".p4-welcome__copy .p4-primary",
  },
  {
    name: "welcome-route-overview",
    group: "optional",
    progress: progressAt("welcome"),
    action: "open-route",
    taskSelector: ".p4-overview-phases",
    actionSelector: ".p4-overview-start",
    gateTaskDensity: false,
  },
  {
    name: "idea-initial",
    group: "core",
    progress: progressAt("idea"),
    ...coreTask,
  },
  {
    name: "idea-risk-feedback",
    group: "feedback",
    progress: progressAt("idea", { ideaChoice: "booking" }),
    ...coreTask,
  },
  {
    name: "idea-playbook-note",
    group: "checkpoint",
    progress: progressAt("idea", completionChoices.idea),
    taskSelector: ".p5-checkpoint",
    actionSelector: ".p5-checkpoint .p4-primary",
    gateTaskDensity: false,
  },
  {
    name: "tools-initial",
    group: "core",
    progress: progressAt("tools"),
    ...coreTask,
  },
  {
    name: "tools-optional-decoder",
    group: "optional",
    progress: progressAt("tools"),
    action: "open-depth",
    ...coreTask,
  },
  {
    name: "project-home-initial",
    group: "core",
    progress: progressAt("project-home"),
    ...coreTask,
  },
  {
    name: "project-home-private-boundary",
    group: "substep",
    progress: progressAt("project-home", {
      projectHomeChoice: "route-home",
    }),
    ...coreTask,
  },
  {
    name: "ask-ai-initial",
    group: "core",
    progress: progressAt("ask-ai"),
    ...coreTask,
  },
  {
    name: "ask-ai-plan-approval",
    group: "substep",
    progress: progressAt("ask-ai", { aiFirstChoice: "inspect-plan" }),
    ...coreTask,
  },
  {
    name: "build-initial",
    group: "core",
    progress: progressAt("build"),
    ...coreTask,
  },
  {
    name: "build-risk-feedback",
    group: "feedback",
    progress: progressAt("build", { buildEvidenceChoice: "preview-only" }),
    ...coreTask,
  },
  {
    name: "check-initial",
    group: "core",
    progress: progressAt("check"),
    ...coreTask,
  },
  {
    name: "check-repair",
    group: "substep",
    progress: progressAt("check", { checkAttemptChoice: "try-contact" }),
    ...coreTask,
  },
  {
    name: "check-retry",
    group: "substep",
    progress: progressAt("check", {
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
    }),
    ...coreTask,
  },
  {
    name: "go-live-initial",
    group: "core",
    progress: progressAt("go-live"),
    ...coreTask,
  },
  {
    name: "go-live-public-proof",
    group: "substep",
    progress: progressAt("go-live", {
      releaseVersionChoice: "v4-checked",
    }),
    ...coreTask,
  },
  {
    name: "go-live-playbook-note",
    group: "checkpoint",
    progress: progressAt("go-live", completionChoices["go-live"]),
    taskSelector: ".p5-checkpoint",
    actionSelector: ".p5-checkpoint .p4-primary",
    gateTaskDensity: false,
  },
  {
    name: "improve-initial",
    group: "core",
    progress: progressAt("improve"),
    ...coreTask,
  },
  {
    name: "improve-risk-feedback",
    group: "feedback",
    progress: progressAt("improve", { improveChoice: "page-only" }),
    ...coreTask,
  },
  {
    name: "completion",
    group: "core",
    progress: progressAt("completion"),
    taskSelector: ".p4-complete__hero",
    actionSelector: ".p4-complete__actions .p4-primary",
  },
  {
    name: "completion-playbook-index",
    group: "optional",
    progress: progressAt("completion"),
    action: "open-playbook",
    taskSelector: ".p4-guide",
    actionSelector: ".p4-guide__index button",
  },
  {
    name: "completion-playbook-card",
    group: "optional",
    progress: progressAt("completion"),
    action: "open-playbook-card",
    taskSelector: ".p4-guide__card",
    actionSelector: ".p4-guide__card button",
    actionOptional: true,
  },
  {
    name: "completion-mirror-step-one",
    group: "optional",
    progress: progressAt("completion"),
    action: "open-mirror",
    taskSelector: ".p4-wizard__step",
    actionSelector: ".p4-wizard input",
  },
  {
    name: "completion-mirror-step-four",
    group: "optional",
    progress: progressAt("completion", {
      mirrorStep: 4,
      mirrorDraft: {
        person: "First-time visitors",
        situation: "They need clear event details",
        usefulResult: "Know what to bring and contact the organizer",
        completePath: "Read the approved facts, then open an email",
        trustedFacts: "Organizer brief, accepted-items list",
        mustHave: "Event facts, accepted items, email action",
        notNow: "Booking, accounts, payments",
        doneWhen: "The public email path works on phone and keyboard",
        toolRoute: "repository",
      },
    }),
    action: "open-mirror",
    taskSelector: ".p4-wizard__step",
    actionSelector: ".p4-wizard__actions .p4-primary",
  },
];

const targets = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
].filter((target) => !requestedTarget || target.name === requestedTarget);

if (targets.length === 0) {
  throw new Error(
    `Unknown AUDIT_TARGET "${requestedTarget}". Use "desktop" or "mobile".`,
  );
}

async function applyScenarioAction(page, action) {
  if (!action) return;

  if (action === "open-route") {
    await page
      .getByRole("button", {
        name: "See exactly what you will learn",
        exact: true,
      })
      .click();
    await page
      .getByRole("dialog", { name: "The whole journey, one decision at a time" })
      .waitFor();
    return;
  }
  if (action === "open-depth") {
    await page.locator(".p4-depth > summary").click();
    return;
  }
  if (action === "open-playbook" || action === "open-playbook-card") {
    await page.getByRole("button", { name: "Open my 5-card Playbook" }).click();
    await page.getByRole("dialog", { name: "Build-with-AI Playbook" }).waitFor();
    if (action === "open-playbook-card") {
      await page.locator(".p4-guide__index button").first().click();
    }
    return;
  }
  if (action === "open-mirror") {
    await page.getByRole("button", { name: "Shape my own V1 brief" }).click();
    await page.getByRole("dialog", { name: "Teaching Mirror" }).waitFor();
    return;
  }

  throw new Error(`Unknown audit action: ${action}`);
}

async function measure(page, scenario) {
  return page.evaluate(
    ({ taskSelector, actionSelector, actionOptional }) => {
      const visibleDialog = [...document.querySelectorAll('[role="dialog"]')].find(
        (element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0
          );
        },
      );
      const root = visibleDialog ?? document.querySelector(".p4-app") ?? document.body;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;

      const wordCount = (value) => {
        const normalized = value.replace(/\s+/g, " ").trim();
        return normalized ? normalized.split(" ").length : 0;
      };

      const isAssistiveOnly = (element) =>
        Boolean(element.closest(".p4-visually-hidden, .p4-skip"));

      const isHiddenByClosedDetails = (element) => {
        const details = element.closest("details:not([open])");
        if (!details) return false;
        const summary = details.querySelector(":scope > summary");
        return !summary?.contains(element);
      };

      const isRenderedElement = (element) => {
        if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
          return false;
        }
        if (isAssistiveOnly(element)) return false;
        if (isHiddenByClosedDetails(element)) return false;
        const style = getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0
        ) {
          return false;
        }
        const rects = element.getClientRects();
        return [...rects].some((rect) => rect.width > 0 && rect.height > 0);
      };

      const isInViewport = (element, fully = false) => {
        if (!isRenderedElement(element)) return false;
        const rect = element.getBoundingClientRect();
        if (fully) {
          return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= viewportHeight &&
            rect.right <= viewportWidth
          );
        }
        return (
          rect.bottom > 0 &&
          rect.top < viewportHeight &&
          rect.right > 0 &&
          rect.left < viewportWidth
        );
      };

      const textNodes = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent?.trim() || !node.parentElement) {
            return NodeFilter.FILTER_REJECT;
          }
          if (isAssistiveOnly(node.parentElement)) {
            return NodeFilter.FILTER_REJECT;
          }
          if (isHiddenByClosedDetails(node.parentElement)) {
            return NodeFilter.FILTER_REJECT;
          }
          const style = getComputedStyle(node.parentElement);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number(style.opacity) === 0
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          const range = document.createRange();
          range.selectNodeContents(node);
          const rects = [...range.getClientRects()].filter(
            (rect) => rect.width > 0 && rect.height > 0,
          );
          if (!rects.length) return NodeFilter.FILTER_REJECT;
          textNodes.push({
            element: node.parentElement,
            text: node.textContent.replace(/\s+/g, " ").trim(),
            rects: rects.map((rect) => ({
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
              left: rect.left,
            })),
          });
          return NodeFilter.FILTER_REJECT;
        },
      });
      while (walker.nextNode()) {
        // Text nodes are collected inside acceptNode so each is measured once.
      }

      const viewportText = textNodes
        .filter((item) =>
          item.rects.some(
            (rect) =>
              rect.bottom > 0 &&
              rect.top < viewportHeight &&
              rect.right > 0 &&
              rect.left < viewportWidth,
          ),
        )
        .map((item) => item.text)
        .join(" ");
      const renderedText = textNodes.map((item) => item.text).join(" ");

      const controls = [...root.querySelectorAll(
        "button, a[href], input, textarea, select, summary",
      )].filter(isRenderedElement);

      const task = taskSelector
        ? root.querySelector(taskSelector) ?? document.querySelector(taskSelector)
        : null;
      const action = actionSelector
        ? root.querySelector(actionSelector) ?? document.querySelector(actionSelector)
        : null;

      const position = (element) => {
        if (!element || !isRenderedElement(element)) return null;
        const rect = element.getBoundingClientRect();
        return {
          selectorMatched: true,
          topPx: Math.round(rect.top),
          bottomPx: Math.round(rect.bottom),
          heightPx: Math.round(rect.height),
          topInViewports: Number((rect.top / viewportHeight).toFixed(2)),
          startsInFirstViewport: rect.top >= 0 && rect.top < viewportHeight,
          intersectsFirstViewport: isInViewport(element),
          fullyInFirstViewport: isInViewport(element, true),
          distanceBelowViewportPx: Math.max(0, Math.round(rect.top - viewportHeight)),
        };
      };

      const taskPosition = position(task);
      const actionPosition = position(action);
      const taskTop = taskPosition?.topPx ?? null;
      const taskTextScope = task?.closest("section") ?? root;
      const wordsBeforeTask =
        taskTop === null
          ? null
          : wordCount(
              textNodes
                .filter(
                  (item) =>
                    taskTextScope.contains(item.element) &&
                    item.rects.every((rect) => rect.bottom <= taskTop),
                )
                .map((item) => item.text)
                .join(" "),
            );

      const textBlocks = [...root.querySelectorAll(
        "p, li, dd, blockquote, summary, code, small",
      )]
        .filter(isRenderedElement)
        .map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
        }))
        .filter((item) => item.text)
        .map((item) => ({ ...item, words: wordCount(item.text) }));

      const rootRect = root.getBoundingClientRect();
      const rootClientHeight =
        root instanceof HTMLElement && root.clientHeight > 0
          ? Math.min(root.clientHeight, viewportHeight)
          : viewportHeight;
      const rootScrollHeight =
        root instanceof HTMLElement
          ? Math.max(root.scrollHeight, Math.round(rootRect.height))
          : document.documentElement.scrollHeight;

      const overflowingElements = [...root.querySelectorAll("*")]
        .filter(isRenderedElement)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            element,
            rect,
            overflowPx: Math.max(0, -rect.left, rect.right - viewportWidth),
          };
        })
        .filter((item) => item.overflowPx > 1)
        .sort((left, right) => right.overflowPx - left.overflowPx);

      const describeElement = ({ element, rect, overflowPx }) => ({
        tag: element.tagName.toLowerCase(),
        className:
          typeof element.className === "string"
            ? element.className.split(/\s+/).filter(Boolean).slice(0, 3).join(".")
            : "",
        widthPx: Math.round(rect.width),
        overflowPx: Math.round(overflowPx),
      });

      const pageHorizontalOverflowPx = Math.max(
        0,
        document.documentElement.scrollWidth - viewportWidth,
      );
      const rootHorizontalOverflowPx =
        root instanceof HTMLElement
          ? Math.max(0, root.scrollWidth - root.clientWidth)
          : pageHorizontalOverflowPx;
      const pageScrollScreens = Number(
        (document.documentElement.scrollHeight / viewportHeight).toFixed(2),
      );
      const scopeScrollScreens = Number(
        (rootScrollHeight / Math.max(1, rootClientHeight)).toFixed(2),
      );

      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      const thresholdChecks = {
        wordsBeforeTaskAtMost95:
          wordsBeforeTask === null ? null : wordsBeforeTask <= 95,
        taskStartsInFirstViewport:
          taskPosition === null ? null : taskPosition.startsInFirstViewport,
        primaryActionWithinShortScroll:
          actionPosition === null
            ? actionOptional
              ? null
              : false
            : actionPosition.distanceBelowViewportPx <= 96,
        noPageHorizontalOverflow: pageHorizontalOverflowPx === 0,
      };

      return {
        scope: visibleDialog ? "dialog" : "app",
        title: root.querySelector("h1, h2")?.textContent?.replace(/\s+/g, " ").trim() ?? null,
        viewportWords: wordCount(viewportText),
        totalRenderedWords: wordCount(renderedText),
        wordsBeforeTask,
        controlsInViewport: controls.filter((control) => isInViewport(control)).length,
        controlsTotal: controls.length,
        taskPosition,
        primaryActionPosition: actionPosition,
        pageScrollScreens,
        scopeScrollScreens,
        pageHorizontalOverflowPx,
        rootHorizontalOverflowPx,
        overflowingElementCount: overflowingElements.length,
        worstOverflowingElements: overflowingElements.slice(0, 5).map(describeElement),
        longBlocksOver45Words: textBlocks.filter((item) => item.words > 45).length,
        longestBlocks: textBlocks
          .sort((left, right) => right.words - left.words)
          .slice(0, 5),
        thresholdChecks,
        responseStartMs: nav ? Math.round(nav.responseStart) : null,
        domContentLoadedMs: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
        loadMs: nav ? Math.round(nav.loadEventEnd) : null,
        transferKb: Math.round(
          resources.reduce(
            (total, entry) => total + (entry.transferSize || 0),
            0,
          ) / 1024,
        ),
      };
    },
    {
      taskSelector: scenario.taskSelector ?? null,
      actionSelector: scenario.actionSelector ?? null,
      actionOptional: scenario.actionOptional === true,
    },
  );
}

function compactResult(result) {
  return {
    scope: result.scope,
    viewportWords: result.viewportWords,
    totalRenderedWords: result.totalRenderedWords,
    wordsBeforeTask: result.wordsBeforeTask,
    controlsInViewport: result.controlsInViewport,
    controlsTotal: result.controlsTotal,
    pageScrollScreens: result.pageScrollScreens,
    scopeScrollScreens: result.scopeScrollScreens,
    taskTopPx: result.taskPosition?.topPx ?? null,
    actionTopPx: result.primaryActionPosition?.topPx ?? null,
    actionDistanceBelowViewportPx:
      result.primaryActionPosition?.distanceBelowViewportPx ?? null,
    pageHorizontalOverflowPx: result.pageHorizontalOverflowPx,
    rootHorizontalOverflowPx: result.rootHorizontalOverflowPx,
    overflowingElementCount: result.overflowingElementCount,
    longBlocksOver45Words: result.longBlocksOver45Words,
    thresholdChecks: result.thresholdChecks,
  };
}

function scenarioViolations(viewport, scenario, result) {
  const violations = [];
  const checks = result.thresholdChecks;
  if (scenario.gateTaskDensity !== false) {
    if (checks.wordsBeforeTaskAtMost95 === false) {
      violations.push(`${viewport}/${scenario.name}: more than 95 words before the task`);
    }
    if (checks.taskStartsInFirstViewport === false) {
      violations.push(`${viewport}/${scenario.name}: task starts below the first viewport`);
    }
    if (checks.primaryActionWithinShortScroll === false) {
      violations.push(`${viewport}/${scenario.name}: primary action needs more than a 96px short scroll`);
    }
  }
  if (checks.noPageHorizontalOverflow === false) {
    violations.push(`${viewport}/${scenario.name}: page has horizontal overflow`);
  }
  return violations;
}

const browser = await chromium.launch();
const audit = {};
const violations = [];

try {
  if (screenshotDirectory) {
    await mkdir(screenshotDirectory, { recursive: true });
  }

  for (const target of targets) {
    audit[target.name] = {};

    for (const scenario of scenarios) {
      process.stderr.write(`Auditing ${target.name}/${scenario.name}\n`);
      const context = await browser.newContext({
        viewport: target.viewport,
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        ({ key, value }) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        },
        { key: storageKey, value: scenario.progress },
      );

      try {
        const page = await context.newPage();
        await page.goto(baseUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});

        if (scenario.progress.started && scenario.progress.stage !== "completion") {
          const resume = page.getByRole("button", { name: /^Resume at / });
          await resume.waitFor({ state: "visible", timeout: 5_000 });
          await resume.click();
        }

        await page.locator("h1").waitFor({ timeout: 15_000 });
        await applyScenarioAction(page, scenario.action);
        await page.evaluate(() => {
          window.scrollTo(0, 0);
          const dialog = document.querySelector('[role="dialog"]');
          if (dialog instanceof HTMLElement) dialog.scrollTop = 0;
        });
        await page.waitForTimeout(100);

        const result = await measure(page, scenario);
        audit[target.name][scenario.name] = {
          group: scenario.group,
          ...result,
        };
        violations.push(...scenarioViolations(target.name, scenario, result));

        if (screenshotDirectory) {
          await page.screenshot({
            path: path.join(
              screenshotDirectory,
              `${target.name}-${scenario.name}.png`,
            ),
            fullPage: screenshotFullPage,
          });
        }
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

const summary = Object.fromEntries(
  Object.entries(audit).map(([viewport, screens]) => [
    viewport,
    Object.fromEntries(
      Object.entries(screens).map(([screen, result]) => [
        screen,
        { group: result.group, ...compactResult(result) },
      ]),
    ),
  ]),
);

console.log(
  JSON.stringify(
    summaryOnly
      ? { baseUrl, storageKey, summary, violations }
      : {
          baseUrl,
          storageKey,
          thresholds: {
            wordsBeforePrimaryTask: 95,
            taskAndPrimaryAction:
              "task starts inside first viewport; action is no more than 96px below it",
            horizontalPageOverflowPx: 0,
          },
          summary,
          violations,
          audit,
        },
    null,
    2,
  ),
);

if (failOnThresholds && violations.length > 0) process.exitCode = 1;
