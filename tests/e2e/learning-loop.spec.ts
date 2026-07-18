import { expect, test, type Page } from "@playwright/test";

async function continueFeedback(page: Page) {
  await expect(page.getByTestId("continue-feedback")).toBeVisible();
  await page.getByTestId("continue-feedback").click();
}

async function begin(page: Page) {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /AI can make it look finished/i })).toBeVisible();
  if (process.env.CAPTURE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/landing.png", fullPage: true });
  }
  await page.getByTestId("start-mission").click();
  await expect(page.getByTestId("scene-arrival")).toBeVisible();
  if (process.env.CAPTURE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/first-look.png", fullPage: true });
  }
}

test("completes the evidence-first build mission and receives a debrief", async ({ page }) => {
  await begin(page);

  await page.getByRole("radio", { name: /Inspect the work/i }).click();
  await page.getByRole("button", { name: "Fairly sure" }).click();
  await page.getByTestId("commit-arrival").click();
  await expect(page.getByText(/Inspection reveals an unsourced guarantee/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /Nearby residents deciding on a phone/i,
    /Know what to bring and decide whether to attend/i,
    /Facts match the source; the mobile action works/i,
    /Accounts, payments, chat, and live inventory/i,
  ]) {
    await page.getByRole("radio", { name }).click();
  }
  await page.getByTestId("commit-target").click();
  await expect(page.getByText(/The Build Map now names/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /README\.md/i,
    /facts\.md/i,
    /Project files and approved assets/i,
    /\.env\.example/i,
    /Initial known-good commit/i,
  ]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByTestId("commit-record").click();
  await expect(page.getByText(/Trusted facts, setup context/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /Audience and outcome/i,
    /facts\.md/i,
    /Current project files/i,
    /Acceptance checks/i,
    /Authority boundary/i,
    /Mobile screenshot/i,
  ]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByTestId("commit-handoff").click();
  await expect(page.getByText(/Context X-ray shows/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [/Add volunteer accounts/i, /Create a live repair database/i, /Build an organizer dashboard/i]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByRole("button", { name: "Very sure" }).click();
  await page.getByTestId("commit-radius").click();
  await expect(page.getByText(/touches only the facts/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /Compare every claim with facts\.md/i,
    /Try the main action at 390px/i,
    /Use the page with only a keyboard/i,
    /Inspect the diff and repository for secrets/i,
    /Read the actual check log/i,
  ]) {
    await page.getByRole("button", { name }).click();
  }
  await page.getByTestId("commit-check").click();
  await expect(page.getByText(/proof ledger exposes/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /An unsupported guarantee appears/i,
    /Open the event section/i,
    /Only sourced claims/i,
    /Approved facts, keyboard path/i,
  ]) {
    await page.getByRole("radio", { name }).click();
  }
  await page.getByRole("button", { name: /Apply the smallest repair/i }).click();
  await page.getByRole("button", { name: /RUN trusted facts/i }).click();
  await page.getByRole("button", { name: /RUN 390px action/i }).click();
  await page.getByTestId("commit-evolve").click();
  await expect(page.getByText(/both original failures now pass/i)).toBeVisible();
  await continueFeedback(page);

  for (const item of [
    /Trusted facts pass/i,
    /Core path works on desktop and mobile/i,
    /Keyboard path remains usable/i,
    /Secrets stay outside tracked files/i,
    /README and limitations are current/i,
    /Create a named, verified commit/i,
  ]) {
    await page.getByRole("button", { name: item }).click();
  }
  await page.getByTestId("commit-ship").click();
  await expect(page.getByText(/final restore point all have current evidence/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /Original receipts and approved budget rules/i,
    /Inspect the changed formula and independently recalculate/i,
    /Preserve the original, repair the one formula/i,
  ]) {
    await page.getByRole("radio", { name }).click();
  }
  await page.getByRole("button", { name: "Very sure" }).click();
  await page.getByTestId("commit-transfer").click();
  await expect(page.getByText(/used receipts as truth/i)).toBeVisible();
  await continueFeedback(page);

  await expect(page.getByTestId("replay")).toBeVisible();
  await expect(page.getByText("100/100")).toBeVisible();
  if (process.env.CAPTURE_SCREENSHOTS) {
    await page.screenshot({ path: "docs/screenshots/build-replay.png", fullPage: true });
  }
  await page.getByLabel(/What will you do differently/i).fill(
    "I will define proof before asking AI to edit, inspect the actual change, and rerun the checks after a bounded repair.",
  );
  await page.getByRole("button", { name: /Create my evidence debrief/i }).click();
  await expect(page.getByText(/Authored judge mode|Personalized live/i)).toBeVisible();
  await expect(page.getByText(/known-good state/i)).toBeVisible();
});

test("makes a plausible but unsupported choice visible and repairable", async ({ page }) => {
  await begin(page);
  await page.getByRole("radio", { name: /Ship it/i }).click();
  await page.getByRole("button", { name: "Very sure" }).click();
  await page.getByTestId("commit-arrival").click();

  await expect(page.getByText(/The main action does nothing/i)).toBeVisible();
  await expect(page.getByText(/creator's assurance is not evidence/i)).toBeVisible();
  await continueFeedback(page);

  for (const name of [
    /Everyone in the city/i,
    /Feel impressed by the design/i,
    /The AI reports that the page is complete/i,
    /Nothing—let the AI add useful ideas/i,
  ]) {
    await page.getByRole("radio", { name }).click();
  }
  await page.getByTestId("commit-target").click();

  await expect(page.getByText(/Not ready—repair the decision/i)).toBeVisible();
  await expect(page.getByText(/broad, subjective, or dependent on the AI/i)).toBeVisible();
  await page.getByTestId("continue-feedback").click();
  await expect(page.getByTestId("scene-target")).toBeVisible();
});
