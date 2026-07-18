import { expect, test } from "@playwright/test";

test("turns a misconception into evidence and verifies transfer", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "What does await actually pause?" }),
  ).toBeVisible();

  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Use a sample belief" }).click();
  await page.getByRole("button", { name: "Lock prediction" }).click();

  await expect(page.getByText("02 · FALSIFIABLE HYPOTHESIS")).toBeVisible();
  await page.getByRole("button", { name: "Run the counterexample" }).click();

  await expect(page.getByText("Counterexample found")).toBeVisible();
  await expect(page.getByText("A  →  B  →  C  →  D", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Repair my model" }).click();

  await page.getByRole("textbox").fill(
    "await suspends the current async function while outside synchronous code continues; the function resumes later in a microtask.",
  );
  await page.getByRole("button", { name: "Check my teach-back" }).click();

  await expect(page.getByText("revised", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Try a fresh case" }).click();

  await page.getByRole("radio").first().check();
  await page.getByRole("textbox").fill(
    "await queues the async continuation as a microtask after synchronous code, and that continuation runs before the timer.",
  );
  await page.getByRole("button", { name: "Commit reason & run" }).click();

  await expect(
    page.getByRole("heading", { name: "Your model transferred." }),
  ).toBeVisible();
  await expect(page.getByText("TRANSFER VERIFIED")).toBeVisible();
});

test("does not unlock transfer when the causal model is still unchanged", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("radio").first().check();
  await page.getByRole("button", { name: "Use a sample belief" }).click();
  await page.getByRole("button", { name: "Lock prediction" }).click();
  await page.getByRole("button", { name: "Run the counterexample" }).click();
  await expect(page.getByText("Counterexample found")).toBeVisible();
  await page.getByRole("button", { name: "Repair my model" }).click();

  await page
    .getByRole("textbox")
    .fill("I saw A B C D, so that must simply be the answer.");
  await page.getByRole("button", { name: "Check my teach-back" }).click();

  await expect(page.getByText("unchanged", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Revise my explanation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Try a fresh case" }),
  ).toHaveCount(0);
});
