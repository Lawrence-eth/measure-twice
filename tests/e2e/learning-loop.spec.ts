import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ timeout: 120_000 });

const correctChoices = {
  target: ["audience-neighbors", "outcome-attend", "proof-behavior", "nongoal-systems"],
  repository: ["readme", "facts", "files", "gitignore", "checkpoint"],
  context: ["goal", "trusted-facts", "current-files", "acceptance", "authority", "mobile-reference"],
  repair: ["observed-exact", "reproduce-exact", "expected-exact", "preserve-verified"],
  transfer: ["source-receipts", "proof-recalc", "next-bounded"],
} as const;

const evidenceChecks = [
  "Compare each public statement with facts.md",
  "Use the contact action at a 390px screen width",
  "Follow the visitor path using only a keyboard",
  "Inspect the saved files and before-and-after changes for credentials",
  "Open the record of checks that actually ran",
] as const;

const postRepairChecks = [
  "Approved facts",
  "390px visibility",
  "Email destination",
  "Keyboard regression",
  "Final saved-file review",
] as const;

const releaseActions = [
  "Record exact version + recovery",
  "Review README + limitations",
  "Run production build",
  "Smoke-test hosted preview",
  "Approve this exact public action",
  "Publish the simulated release",
  "Smoke-test the live URL",
] as const;

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

function choice(page: Page, id: string) {
  return page.locator(`[data-choice-id="${id}"]`);
}

async function choose(page: Page, id: string) {
  const card = choice(page, id);
  await expect(card, `choice ${id} should be reachable`).toBeVisible();
  await card.click();
}

async function chooseMany(page: Page, ids: readonly string[]) {
  for (const id of ids) await choose(page, id);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
            typeof element.className === "string" && element.className.trim()
              ? `.${element.className.trim().split(/\s+/).join(".")}`
              : ""
          }`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      })
      .filter(({ left, right }) => left < -1 || right > document.documentElement.clientWidth + 1)
      .slice(0, 12),
  }));
  expect(
    dimensions.scrollWidth,
    `document width ${dimensions.scrollWidth}px should fit the ${dimensions.clientWidth}px viewport; offenders: ${JSON.stringify(dimensions.offenders)}`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectAxeClean(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags(wcagTags);
  if (include) builder = builder.include(include);
  const result = await builder.analyze();
  const summary = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));
  expect(summary, `axe violations: ${JSON.stringify(summary, null, 2)}`).toEqual([]);
}

async function prepareScreenshot(page: Page) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });
  await page.waitForTimeout(100);
}

async function expectScene(page: Page, scene: string, heading: RegExp | string) {
  await expect(page.getByTestId(`scene-${scene}`)).toBeVisible();
  await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  if ((page.viewportSize()?.width ?? 1_000) <= 390) await expectNoHorizontalOverflow(page);
}

async function openFresh(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");
  await expect(page.getByTestId("intro")).toBeVisible();
  await expect(page.getByRole("heading", { name: /The first draft is easy/i, level: 1 })).toBeVisible();
}

async function begin(page: Page) {
  await openFresh(page);
  await page.getByTestId("start-mission").click();
  await expectScene(page, "arrival", "The AI says it’s ready.");
}

async function submitAndContinue(
  page: Page,
  testId: string,
  expectedEvidence?: RegExp,
) {
  await page.getByTestId(testId).click();
  const dialog = page.getByTestId("consequence-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("role", "dialog");
  await expect(dialog.getByRole("heading", { name: "Consequence recorded" })).toBeVisible();
  if (expectedEvidence) await expect(dialog).toContainText(expectedEvidence);
  await expect(page.getByTestId("continue-feedback")).toBeFocused();
  await page.getByTestId("continue-feedback").click();
  await expect(dialog).toBeHidden();
}

async function completeArrival(page: Page, checkTransitionFocus = false) {
  await choose(page, "inspect");
  await page.getByRole("button", { name: "Fairly sure" }).click();
  await page.getByTestId("commit-arrival").click();

  const dialog = page.getByTestId("consequence-dialog");
  await expect(dialog).toContainText(/unsourced guarantee, a clipped contact action with no email destination, and an empty execution record/i);
  await expect(page.getByTestId("continue-feedback")).toBeFocused();

  if (checkTransitionFocus) await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.getByTestId("continue-feedback").click();
  await expectScene(page, "target", "Turn a wish into a promise.");
  if (checkTransitionFocus) {
    await expect(page.getByRole("heading", { name: "Turn a wish into a promise.", level: 1 })).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  }
}

async function completeTarget(page: Page) {
  await chooseMany(page, correctChoices.target);
  await submitAndContinue(page, "commit-target", /phone-first person, a meaningful outcome, observable checks/i);
  await expectScene(page, "record", "Give the project a memory—and an undo button.");
}

async function completeRecord(page: Page) {
  await chooseMany(page, correctChoices.repository);
  await expect(page.getByLabel("Simulated GitHub repository")).toContainText("baseline saved · unverified");
  await expect(page.getByLabel("Simulated GitHub repository")).not.toContainText("baseline saved · known good");
  await submitAndContinue(page, "commit-record", /unverified baseline/i);
  await expectScene(page, "handoff", "Make the AI’s field of view visible.");
}

async function completeHandoff(page: Page) {
  await choose(page, "plan");
  await chooseMany(page, correctChoices.context);
  await submitAndContinue(page, "commit-handoff", /Plan mode, goal, sources, current state, checks, permission boundary/i);
  await expectScene(page, "radius", "Review the change footprint before editing.");
}

async function setScope(page: Page, id: string, disposition: "keep" | "defer" | "needs-answer") {
  const input = page.locator(`input[name="scope-${id}"][value="${disposition}"]`);
  await expect(input).toBeVisible();
  await input.click();
  await expect(input).toBeChecked();
}

async function completeScope(page: Page) {
  for (const id of ["facts-section", "mobile-action", "verify"]) await setScope(page, id, "keep");
  for (const id of ["accounts", "database", "admin"]) await setScope(page, id, "defer");
  await setScope(page, "joining-flow", "needs-answer");
  await page.getByRole("button", { name: "Very sure" }).click();
  await submitAndContinue(page, "commit-radius", /kept, deferred, or held for a stakeholder answer/i);
  await expectScene(page, "check", "Put every “done” claim on trial.");
  await expect(
    page.getByRole("heading", { name: "Put every “done” claim on trial.", level: 1 }),
    "the scene transition should finish moving focus before its controls are exercised",
  ).toBeFocused();
}

async function exerciseTabs(page: Page) {
  const preview = page.getByRole("tab", { name: "Preview" });
  const changes = page.getByRole("tab", { name: "What changed" });
  const ledger = page.getByRole("tab", { name: "Evidence ledger" });

  await expect(preview).toHaveAttribute("aria-selected", "true");
  await preview.focus();
  await preview.press("ArrowRight");
  await expect(changes).toBeFocused();
  await expect(changes).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("No test output attached");
  await changes.press("End");
  await expect(ledger).toHaveAttribute("aria-selected", "true");
  await expect(ledger).toHaveAttribute("tabindex", "0");
  await expect(page.getByRole("tabpanel")).toContainText("Claims match facts.md");
  await ledger.focus();
  await ledger.press("Home");
  await expect(preview).toBeFocused();
  await expect(preview).toHaveAttribute("aria-selected", "true");
}

async function completeCheck(page: Page, testTabs = false) {
  if (testTabs) await exerciseTabs(page);
  for (const title of evidenceChecks) {
    await page.getByRole("button", { name: title, exact: false }).click();
  }

  const inspection = page.locator(".evidence-inspection");
  await expect(inspection).toContainText("Open the record of checks that actually ran");
  await expect(inspection).toContainText(/no command, procedure, time, output, or result/i);
  await expect(inspection).toContainText("Evidence location");
  await expect(inspection).toContainText("Does not establish");
  await expect(page.getByRole("tabpanel")).toContainText("Named checks actually ran");
  if (testTabs) await expectAxeClean(page);
  await submitAndContinue(page, "commit-check", /invented guarantee, a clipped\/dead contact action, and an empty execution record/i);
  await expectScene(page, "evolve", "Repair the gap—not the whole project.");
}

async function completeRepair(page: Page) {
  await chooseMany(page, correctChoices.repair);
  await page.getByRole("button", { name: /Diagnose before editing/i }).click();
  await expect(page.getByText("Diagnosis recorded · no files changed")).toBeVisible();
  await expect(page.locator(".diagnosis-panel")).toContainText("Likely causes:");
  await page.getByRole("button", { name: /Approve this bounded patch/i }).click();

  const repairedAction = page.locator('a.mock-cta[href="mailto:hello@repair-cafe.example"]');
  await expect(repairedAction).toBeVisible();
  await expect(repairedAction).toHaveAttribute("href", "mailto:hello@repair-cafe.example");
  await repairedAction.focus();
  await expect(repairedAction).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("Destination verified: hello@repair-cafe.example");

  for (const title of postRepairChecks) {
    const button = page.getByRole("button", { name: new RegExp(title, "i") });
    await button.click();
    await expect(button).toContainText("PASS");
  }
  await expect(page.locator(".retest-panel button.is-pass")).toHaveCount(5);
  await submitAndContinue(page, "commit-evolve", /action fits at 390px, opens the correct email, still works by keyboard/i);
  await expectScene(page, "ship", "Publish the exact state you proved.");
}

async function completeRelease(page: Page, screenshotPath?: string) {
  const ledger = page.getByRole("table", { name: "Release claims, generated status, source, and evidence" });
  await expect(ledger.locator("tbody tr")).toHaveCount(10);
  await expect(ledger.getByRole("checkbox")).toHaveCount(0);
  await expect(ledger.locator("tbody tr.release-row--missing")).not.toHaveCount(0);

  for (let index = 0; index < releaseActions.length; index += 1) {
    const action = page.getByRole("button", { name: releaseActions[index], exact: false });
    if (index > 0) await expect(action).toBeEnabled();
    await action.click();
    await expect(action).toHaveClass(/is-complete/);
  }

  await expect(ledger.locator("tbody tr.release-row--pass")).toHaveCount(10);
  await expect(ledger.locator("tbody tr.release-row--missing")).toHaveCount(0);
  await expect(page.locator(".release-card")).toContainText("c7a91e4");
  await expect(page.locator(".release-card")).toContainText("Exact live version verified");
  await expectAxeClean(page);
  if (screenshotPath) {
    await prepareScreenshot(page);
    await page.screenshot({ path: screenshotPath });
  }
  await submitAndContinue(page, "commit-ship", /same version/i);
  await expectScene(page, "transfer", "The interface changed. Did the method transfer?");
}

async function completeTransfer(page: Page) {
  await chooseMany(page, correctChoices.transfer);
  await page.getByLabel(/What would you tell the budget owner/i).fill(
    "The approved receipts and independent B2–B4 calculation prove $385.15. This check does not yet prove the rest of the workbook is correct.",
  );
  await expect(page.getByText("enough reasoning to review")).toBeVisible();
  await page.getByRole("button", { name: "Very sure" }).click();
  await submitAndContinue(page, "commit-transfer", /receipts as truth, inspected and recalculated the formula/i);
  await expectScene(page, "replay", /The page changed.*Your method changed more/i);
}

test("completes the independent evidence path, releases a derived record, and receives a debrief", async ({ page }, testInfo) => {
  const captureScreenshots = Boolean(process.env.CAPTURE_SCREENSHOTS);
  const mobileProject = testInfo.project.name === "mobile-chromium";
  const screenshotSuffix = mobileProject ? "-mobile" : "";
  await page.setViewportSize(mobileProject
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1000 });

  await openFresh(page);
  if (captureScreenshots) {
    await prepareScreenshot(page);
    await page.screenshot({ path: `docs/screenshots/landing${screenshotSuffix}.png`, fullPage: true });
  }
  await expectAxeClean(page);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.getByTestId("start-mission").click();
  await expectScene(page, "arrival", "The AI says it’s ready.");
  await expect(page.getByRole("heading", { name: "The AI says it’s ready.", level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  if (captureScreenshots) {
    await prepareScreenshot(page);
    await page.screenshot({ path: `docs/screenshots/first-look${screenshotSuffix}.png` });
  }
  await expectAxeClean(page);

  await choose(page, "inspect");
  await page.getByRole("button", { name: "Fairly sure" }).click();
  await page.getByTestId("commit-arrival").click();
  await expectAxeClean(page, '[data-testid="consequence-dialog"]');
  await page.getByTestId("continue-feedback").click();
  await expectScene(page, "target", "Turn a wish into a promise.");

  await completeTarget(page);
  await completeRecord(page);
  await completeHandoff(page);
  await completeScope(page);
  await completeCheck(page, true);
  await completeRepair(page);
  await completeRelease(page, captureScreenshots ? `docs/screenshots/release-ledger${screenshotSuffix}.png` : undefined);
  await completeTransfer(page);

  const replay = page.getByTestId("replay");
  await expect(replay).toContainText("Revision Trace · Studio case complete");
  await expect(page.locator("output")).toHaveText("1 of 8 · First layer");
  await expect(page.getByRole("button", { name: "← Previous layer" })).toBeDisabled();
  await page.getByRole("button", { name: "Next layer →" }).click();
  await expect(page.locator("output")).toHaveText("2 of 8 · Target");
  await page.getByLabel("Revision trace position").fill("7");
  await expect(page.locator("output")).toHaveText("8 of 8 · Transfer");
  await expect(page.getByRole("button", { name: "Next layer →" })).toBeDisabled();
  await page.getByRole("button", { name: "← Previous layer" }).click();
  await expect(page.locator("output")).toHaveText("7 of 8 · Release");
  await expect(replay).toContainText("10 / 10 release claims supported");
  await expect(replay).toContainText(/Your reasoning:.*approved receipts and independent B2–B4 calculation prove \$385\.15/i);
  await expect(replay).not.toContainText("100/100");
  await expectAxeClean(page);
  if (captureScreenshots) {
    await prepareScreenshot(page);
    if (mobileProject) await page.locator(".replay__hero").screenshot({ path: "docs/screenshots/revision-trace-mobile.png" });
    else await replay.screenshot({ path: "docs/screenshots/revision-trace.png" });
  }

  await page.getByLabel(/Which AI claim did you come closest to accepting/i).fill(
    "I almost accepted the completion summary. Next time I will inspect the source, run the named path, and preserve the real result for the exact version.",
  );
  await page.getByRole("button", { name: /Create my evidence debrief/i }).click();
  const debrief = page.locator(".debrief-result");
  await expect(debrief).toBeVisible({ timeout: 30_000 });
  await expect(debrief).toContainText(/Authored judge mode|Personalized live/);
  await expect(debrief.getByRole("listitem")).not.toHaveCount(0);
});

test("keeps plausible-choice teaching hidden until commitment, then gives precise repair feedback", async ({ page }) => {
  await begin(page);
  await choose(page, "inspect");
  await page.getByRole("button", { name: "Fairly sure" }).click();
  await page.getByTestId("commit-arrival").click();

  const consequence = page.getByTestId("consequence-dialog");
  await expect(page.getByTestId("continue-feedback")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(consequence, "consequences cannot be dismissed before they are read").toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.getByTestId("continue-feedback").click();
  await expectScene(page, "target", "Turn a wish into a promise.");
  await expect(page.getByRole("heading", { name: "Turn a wish into a promise.", level: 1 })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const plausibleChoice = choice(page, "audience-everyone");
  await expect(plausibleChoice).toContainText("Local people interested in community repair events");
  await expect(plausibleChoice.locator("small"), "explanation should not coach the learner before commitment").toHaveCount(0);
  await chooseMany(page, ["audience-everyone", "outcome-impressive", "proof-ai", "nongoal-none"]);
  await page.getByTestId("commit-target").click();

  await expect(consequence.getByRole("heading", { name: "This decision needs revision" })).toBeVisible();
  await expect(consequence).toContainText(/broad, subjective, or dependent on the AI judging itself/i);
  await expect(page.getByTestId("continue-feedback")).toHaveText(/Revise my decision/i);
  await page.keyboard.press("Escape");
  await expect(consequence).toBeVisible();
  await page.getByTestId("continue-feedback").click();

  await expect(plausibleChoice.locator("small")).toContainText(/combines many situations/i);
  const broadAudience = page.locator('input[name="target-audience"][value="audience-everyone"]');
  const boundedAudience = page.locator('input[name="target-audience"][value="audience-neighbors"]');
  await broadAudience.focus();
  await broadAudience.press("ArrowRight");
  await expect(boundedAudience, "native radio groups should retain browser keyboard behavior").toBeChecked();
});

test("traps and restores focus for the manual and requires confirmation before restart", async ({ page }) => {
  await begin(page);
  const manualTrigger = page.getByRole("button", { name: /^Field notes/ });
  await manualTrigger.click();
  const manual = page.getByTestId("field-manual-dialog");
  const manualClose = page.getByRole("button", { name: "Close field manual" });
  await expect(manual).toBeVisible();
  await expect(manual).toHaveAttribute("aria-modal", "true");
  await expect(manualClose).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(manual.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(manual).toBeHidden();
  await expect(manualTrigger).toBeFocused();

  const restartTrigger = page.getByRole("button", { name: "Restart mission" });
  await restartTrigger.click();
  const restart = page.getByTestId("restart-dialog");
  const keep = page.getByRole("button", { name: "Keep my progress" });
  const erase = page.getByRole("button", { name: "Erase progress and restart" });
  await expect(restart).toHaveAttribute("role", "alertdialog");
  await expect(restart).toContainText("It cannot be undone");
  await expect(keep).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(erase).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(keep, "Tab from the final control should remain inside the modal").toBeFocused();
  await page.keyboard.press("Escape");
  await expect(restart).toBeHidden();
  await expect(restartTrigger).toBeFocused();
  await expect(page.getByTestId("scene-arrival")).toBeVisible();

  await restartTrigger.click();
  await erase.click();
  await expect(page.getByTestId("intro")).toBeVisible();
  await expect(page.getByTestId("scene-arrival")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.localStorage.getItem("pentimento:mission:v2:repair-cafe"))).not.toContain("\"started\":true");
});

test("fits and remains operable at 320px, 390px, and 768px", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await openFresh(page);
    await expectNoHorizontalOverflow(page);
    await page.getByTestId("start-mission").click();
    await expectScene(page, "arrival", "The AI says it’s ready.");
    await expect(page.getByLabel(/Mission progress: Step 1 of 10: First layer/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Field notes/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restart mission" })).toBeVisible();

    const previewAction = page.getByRole("button", { name: /Ask about a repair/i });
    await previewAction.scrollIntoViewIfNeeded();
    await expect(previewAction).toBeVisible();
    const [actionBox, deviceBox] = await Promise.all([
      previewAction.boundingBox(),
      page.locator(".scene-grid--arrival .device").boundingBox(),
    ]);
    expect(actionBox).not.toBeNull();
    expect(deviceBox).not.toBeNull();
    if (width <= 390) {
      expect(actionBox!.x + actionBox!.width).toBeGreaterThan(deviceBox!.x + deviceBox!.width);
    }
    await previewAction.click();
    await expect(page.getByRole("status")).toContainText("Nothing happened. The action has no destination.");
    await expectNoHorizontalOverflow(page);
  }
});
