import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ timeout: 120_000 });

const STORAGE_KEY = "pentimento-studio-v3";
const wcagTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
] as const;

async function expectAxeClean(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([...wcagTags]);
  if (include) builder = builder.include(include);

  const result = await builder.analyze();
  const summary = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));

  expect(summary, `axe violations: ${JSON.stringify(summary, null, 2)}`).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: `${element.tagName.toLowerCase()}${
            element.id ? `#${element.id}` : ""
          }${
            typeof element.className === "string" && element.className.trim()
              ? `.${element.className.trim().split(/\s+/).join(".")}`
              : ""
          }`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      })
      .filter(
        ({ left, right }) =>
          left < -1 || right > document.documentElement.clientWidth + 1,
      )
      .slice(0, 12),
  }));

  expect(
    dimensions.scrollWidth,
    `document width ${dimensions.scrollWidth}px should fit the ${
      dimensions.clientWidth
    }px viewport; offenders: ${JSON.stringify(dimensions.offenders)}`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function openFresh(page: Page) {
  const marker = `pentimento-e2e-fresh-${Date.now()}-${Math.random()}`;
  await page.addInitScript(
    ({ key, markerKey }) => {
      if (window.sessionStorage.getItem(markerKey) === "done") return;
      window.localStorage.removeItem(key);
      window.sessionStorage.setItem(markerKey, "done");
    },
    { key: STORAGE_KEY, markerKey: marker },
  );
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Build your first project with AI.*from idea to live link/i,
    }),
  ).toBeVisible();
}

async function startToIdea(page: Page) {
  await openFresh(page);

  await page.getByRole("button", { name: /Show me the route/i }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Most first projects need three roles.*not twenty tools/i,
    }),
  ).toBeFocused();

  await page
    .getByRole("button", { name: /See the project beneath the surface/i })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /The finished page is only the visible surface/i,
    }),
  ).toBeFocused();

  await page.getByRole("button", { name: /Begin with the rough idea/i }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Turn a wish into a first version",
    }),
  ).toBeFocused();
}

async function openCompletedJourney(page: Page) {
  const fixture = {
    version: 3,
    started: true,
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
    toolLane: "repository",
    foundationStep: 5,
    promptParts: ["purpose", "truth", "limits", "mode", "done"],
    planApproved: true,
    buildCycle: 3,
    buildPhase: "ask",
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
    finished: true,
  };

  await page.addInitScript(
    ({ key, value }) =>
      window.localStorage.setItem(key, JSON.stringify(value)),
    { key: STORAGE_KEY, value: fixture },
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /You were at your completed playbook/i,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Resume where I left off" })
    .click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /You now know where to start/i,
    }),
  ).toBeFocused();
}

async function completeIdea(page: Page) {
  const decisions = [
    "First version",
    "First version",
    "Later",
    "Later",
    "Later",
    "Later",
  ] as const;

  for (let index = 0; index < decisions.length; index += 1) {
    await expect(page.getByText(`Feature ${index + 1} of 6`, { exact: true })).toBeVisible();
    const choice = page.getByRole("button", {
      name: decisions[index],
      exact: true,
    });
    await choice.click();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".feature-result")).toContainText(
      /Worked-example recommendation/i,
    );
    await page.locator(".feature-result button").click();
  }

  await expect(page.locator(".brief-sheet")).toContainText("FIRST-VERSION BRIEF");
  await expect(page.locator(".brief-sheet")).toContainText("2 now · 4 later");
  await page
    .getByRole("button", { name: /Next: choose where to build/i })
    .click();
}

async function completeTools(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Choose a sensible place to start",
    }),
  ).toBeFocused();

  const repositoryCard = page
    .locator(".lane-card")
    .filter({ hasText: "Most transferable" });
  const repositoryLane = repositoryCard.getByRole("button");
  await repositoryLane.click();
  await expect(repositoryLane).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".lane-decision")).toContainText(
    /repository lane/i,
  );
  await expect(page.locator(".tool-name-decoder > summary")).toContainText(
    /see where names like ChatGPT, Codex, Cursor, Lovable, and Replit fit/i,
  );
  await page
    .getByRole("button", { name: /Next: give the project a safe home/i })
    .click();
}

async function completeProjectHome(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Create files you can understand and recover",
    }),
  ).toBeFocused();

  for (let step = 1; step <= 5; step += 1) {
    await expect(
      page.getByText(`Foundation step ${step} of 5`, { exact: true }),
    ).toBeVisible();
    await page.locator(".foundation-step > button").click();
  }

  await expect(page.locator(".foundation-step")).toContainText(
    "FOUNDATION COMPLETE",
  );
  await expect(page.getByText(/No real key belongs in a prompt/i)).toBeVisible();
  await page
    .getByRole("button", { name: /Next: give AI its first task/i })
    .click();
}

async function completeAsk(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Ask for a plan before asking for everything",
    }),
  ).toBeFocused();

  for (let part = 0; part < 5; part += 1) {
    await expect(
      page.getByText(`${part} of 5 parts`, { exact: true }),
    ).toBeVisible();
    await page.locator(".prompt-builder__step button").click();
  }

  await expect(page.locator(".prompt-complete")).toContainText(
    /Do not edit files yet/i,
  );
  await page
    .getByRole("button", { name: "Approve the three-cycle plan" })
    .click();
  await expect(page.locator(".verified-note")).toContainText("Plan approved");
  await page
    .getByRole("button", { name: /Next: build in small visible cycles/i })
    .click();
}

async function completeBuild(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build through three small cycles",
    }),
  ).toBeFocused();

  for (let cycle = 1; cycle <= 3; cycle += 1) {
    await expect(
      page.getByText(`Cycle ${cycle} of 3`, { exact: true }),
    ).toBeVisible();
    for (let phase = 0; phase < 5; phase += 1) {
      await page.locator(".build-studio__action button").click();
    }
  }

  await expect(page.locator(".cycle-summary")).toContainText(
    "THREE RECOVERABLE VERSIONS",
  );
  await expect(page.locator(".cycle-summary li")).toHaveCount(3);
  await page
    .getByRole("button", { name: /Next: check the project yourself/i })
    .click();
}

async function completeCheck(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Find and repair what the preview hides",
    }),
  ).toBeFocused();

  for (let lens = 1; lens <= 3; lens += 1) {
    await expect(
      page.getByText(`LENS ${lens} OF 3`, { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Run this simulated check" })
      .click();
  }

  await expect(page.locator(".defect-report article")).toHaveCount(3);
  await page
    .getByRole("button", {
      name: /Assemble the bounded repair request/i,
    })
    .click();
  await expect(page.locator(".repair-prompt")).toContainText(
    /Observed: the page says/i,
  );
  await page
    .getByRole("button", {
      name: "Apply the simulated repair and rerun checks",
    })
    .click();

  await expect(page.locator(".version-review")).toContainText(
    /supported by current checks/i,
  );
  await expect(
    page.getByRole("group", { name: "Project versions" }).getByRole("button"),
  ).toHaveCount(5);
  await expectAxeClean(page);
  await page
    .getByRole("button", { name: /Next: move V4 toward a live link/i })
    .click();
}

async function completeRelease(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Move safely from your computer to a live link",
    }),
  ).toBeFocused();

  for (const label of ["Local", "GitHub", "Preview", "Live", "Recovery"]) {
    await expect(page.locator(".release-stage > span")).toHaveText(label.toUpperCase());
    await page.locator(".release-stage > button").click();
  }

  await expect(page.locator(".release-card")).toContainText(
    "SIMULATED RELEASE CARD",
  );
  await expect(page.locator(".release-card")).toContainText(
    "https://repair-cafe.example",
  );
  await page
    .getByRole("button", { name: /Next: make the first live update/i })
    .click();
}

async function completeImprove(page: Page) {
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Handle the first real update",
    }),
  ).toBeFocused();

  for (let step = 1; step <= 4; step += 1) {
    await expect(
      page.getByText(`UPDATE STEP ${step} OF 4`, { exact: true }),
    ).toBeVisible();
    await page.locator(".improve-action > button").click();
  }

  await expect(page.locator(".update-complete")).toContainText(
    "NEW RECOVERABLE VERSION",
  );
  await page
    .getByRole("button", { name: /Open my First AI Build Playbook/i })
    .click();
}

async function completeJourney(page: Page) {
  await completeIdea(page);
  await completeTools(page);
  await completeProjectHome(page);
  await completeAsk(page);
  await completeBuild(page);
  await completeCheck(page);
  await completeRelease(page);
  await completeImprove(page);
}

test("explains the route, tool roles, and outcome before asking a beginner to decide", async ({
  page,
}) => {
  await openFresh(page);

  await expect(page.getByText("A guided first AI build", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Experience details")).toContainText(
    "No coding experience needed",
  );
  await expect(page.getByText("Nothing real is published", { exact: true })).toBeVisible();
  await expect(page.getByText("No API key needed", { exact: true })).toBeVisible();
  await expect(page.getByText("About 25 minutes", { exact: true })).toBeVisible();

  const route = page.getByLabel("What you will learn");
  await expect(route.getByRole("listitem")).toHaveCount(8);
  await expect(route).toContainText("Idea");
  await expect(route).toContainText("Go live");
  await expect(route).toContainText(
    "You leave with a reusable First AI Build Playbook.",
  );
  await expectAxeClean(page);

  await page.getByRole("button", { name: /Show me the route/i }).click();
  await expect(page.locator(".system-map > li")).toHaveCount(3);
  await expect(page.getByText("AI workspace", { exact: true })).toBeVisible();
  await expect(page.getByText("Repository", { exact: true })).toBeVisible();
  await expect(page.getByText("Web host", { exact: true })).toBeVisible();
  await expect(page.locator(".system-map__line")).toContainText(
    /AI helps build.*project home remembers.*host publishes/i,
  );
  await expect(page.locator(".runtime-callout")).toContainText(
    /Usually not.*finished product needs an AI API only/i,
  );

  await page
    .getByRole("button", { name: /See the project beneath the surface/i })
    .click();
  const reveal = page.getByRole("slider", { name: /Visible surface/i });
  await expect(reveal).toHaveValue("52");
  await page
    .getByRole("button", { name: "Reveal more earlier layers" })
    .click();
  await expect(reveal).toHaveValue("37");
  await expect(page.getByText(/brief, files, AI requests, checks/i)).toBeVisible();
  await expectAxeClean(page);
});

test("completes one coherent idea-to-live route and earns a reusable playbook", async ({
  page,
}) => {
  await startToIdea(page);
  await completeJourney(page);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /You now know where to start/i,
    }),
  ).toBeFocused();
  await expect(page.getByText(/rough idea through tool choice/i)).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "First AI Build Playbook",
    }),
  ).toBeVisible();
  await expect(page.locator(".playbook-card")).toHaveCount(10);
  await expect(page.locator(".playbook-card.is-practiced")).toHaveCount(10);
  await expect(page.getByRole("heading", { name: "Your first seven days" })).toBeVisible();

  await page.getByRole("button", { name: "Copy complete playbook" }).click();
  await expect(page.locator(".copy-status")).toHaveText(
    "Complete playbook copied.",
  );

  const saved = await page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
  expect(saved).toMatchObject({
    version: 3,
    started: true,
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
    finished: true,
  });
  await expectAxeClean(page);
});

test("makes every practical template available from the first lesson", async ({
  page,
}) => {
  await startToIdea(page);

  const trigger = page.getByRole("button", { name: /My playbook/ });
  await trigger.click();
  const playbook = page.getByRole("dialog", {
    name: "Your First AI Build Playbook",
  });
  await expect(playbook).toBeVisible();
  await expect(playbook).toHaveAttribute("aria-modal", "true");
  await expect(
    playbook.getByRole("button", { name: "Close playbook" }),
  ).toBeFocused();
  await expect(playbook.locator(".playbook-card")).toHaveCount(10);
  await expect(playbook.getByText("Available now", { exact: true })).toHaveCount(10);
  await expect(playbook).toContainText("Choose a starting lane");
  await expect(playbook).toContainText("Define the first complete version");
  await expect(playbook).toContainText("Protect credentials and private data");
  await expect(playbook).toContainText("Publish one checked version");
  await expect(
    playbook.getByRole("button", { name: "Copy blank template" }),
  ).toHaveCount(10);

  const firstCard = playbook.locator(".playbook-card").first();
  await firstCard.getByText("Worked example and blank template").click();
  await expect(firstCard).toContainText(/My product.*need AI at runtime/i);
  await firstCard.getByRole("button", { name: "Copy blank template" }).click();
  await expect(playbook.getByRole("status")).toHaveText(
    "Choose a starting lane copied.",
  );
  await expectAxeClean(page, '[role="dialog"]');

  await page.keyboard.press("Escape");
  await expect(playbook).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("uses the optional Teaching Mirror for bounded reflection without grading", async ({
  page,
}) => {
  await openCompletedJourney(page);

  const mirror = page.locator(".teaching-mirror");
  await expect(mirror.locator("summary")).toContainText(
    "Optional · GPT-5.6 Teaching Mirror",
  );
  await expect(mirror.locator("summary")).toContainText(
    /does not grade, build, publish, or control your progress/i,
  );
  await mirror.locator("summary").click();

  await expect(mirror.getByRole("textbox")).toHaveCount(8);
  const ask = mirror.getByRole("button", { name: "Ask the Teaching Mirror" });
  await expect(ask).toBeDisabled();
  await mirror.getByRole("button", { name: "Load a tiny example" }).click();
  await expect(ask).toBeEnabled();
  await expect(mirror).toContainText(
    /No project files or progress history are attached automatically/i,
  );

  const response = page.waitForResponse(
    (candidate) =>
      candidate.url().endsWith("/api/debrief") &&
      candidate.request().method() === "POST",
  );
  await ask.click();
  const teachingResponse = await response;
  expect(teachingResponse.status()).toBe(200);
  expect(teachingResponse.ok()).toBe(true);

  const result = mirror.locator(".mirror-result");
  await expect(
    result.getByRole("heading", {
      name: "Questions and next moves—not a score.",
    }),
  ).toBeVisible();
  await expect(result).toContainText("Authored practice reflection");
  await expect(result.locator(".mirror-result__strength")).not.toBeEmpty();

  const assumptions = result
    .locator("article")
    .filter({ hasText: "Two assumptions to resolve" });
  await expect(assumptions.getByRole("listitem")).toHaveCount(2);

  const postponement = result
    .locator("article")
    .filter({ hasText: "Candidate to postpone" });
  await expect(
    postponement.getByRole("heading", { name: "Member accounts" }),
  ).toBeVisible();
  await expect(result.locator(".mirror-result__moves").getByRole("listitem")).toHaveCount(3);
  await expect(result).not.toContainText(/\bgrade(?:d)?\b|score:|\b\d+\s*\/\s*\d+\b/i);
  await expectAxeClean(page);
});

test("restores exact in-lesson choices and build phase after a reload", async ({
  page,
}) => {
  await startToIdea(page);

  await page.getByRole("button", { name: "First version", exact: true }).click();
  await page.locator(".feature-result button").click();
  await page.getByRole("button", { name: "Later", exact: true }).click();
  await expect
    .poll(async () => {
      const raw = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      stage: "idea",
      ideaStep: 1,
      featureDecisions: {
        "Event facts and accepted-item list": "now",
        "Email link": "later",
      },
    });

  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /You were at Idea/i,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Resume where I left off" })
    .click();
  await expect(page.getByText("Feature 2 of 6", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Email link" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Later", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");

  const buildFixture = {
    version: 3,
    started: true,
    stage: "build",
    completedStages: ["idea", "tools", "home", "ask"],
    revealPercent: 37,
    featureDecisions: {
      "Event facts and accepted-item list": "now",
      "Email link": "now",
    },
    ideaStep: 6,
    toolLane: "repository",
    foundationStep: 5,
    promptParts: ["purpose", "truth", "limits", "mode", "done"],
    planApproved: true,
    buildCycle: 1,
    buildPhase: "check",
    checksRun: [],
    repairPrepared: false,
    repairApplied: false,
    versionFocus: 0,
    releaseStep: 0,
    improveStep: 0,
    finished: false,
  };
  await page.evaluate(
    ({ key, fixture }) =>
      window.localStorage.setItem(key, JSON.stringify(fixture)),
    { key: STORAGE_KEY, fixture: buildFixture },
  );
  await page.reload();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /You were at Build/i,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Resume where I left off" })
    .click();
  await expect(page.getByText("Cycle 2 of 3", { exact: true })).toBeVisible();
  await expect(page.locator(".build-loop .is-current")).toContainText("Check");
  await expect(page.locator(".agent-pane > header")).toContainText("check");
});

test("traps focus in restart confirmation and clears only after confirmation", async ({
  page,
}) => {
  await startToIdea(page);
  await page.getByRole("button", { name: "First version", exact: true }).click();

  const trigger = page.getByRole("button", { name: "Start over", exact: true });
  await trigger.click();
  const dialog = page.getByRole("alertdialog", {
    name: "Start the journey again?",
  });
  const keep = dialog.getByRole("button", { name: "Keep my progress" });
  const remove = dialog.getByRole("button", {
    name: "Remove progress and restart",
  });

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toContainText(/removes your current route, choices/i);
  await expect(keep).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(remove).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(keep).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await remove.click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Build your first project with AI.*from idea to live link/i,
    }),
  ).toBeVisible();
  await expect
    .poll(async () => {
      const raw = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      version: 3,
      started: false,
      stage: "welcome",
      featureDecisions: {},
    });
});

test("fits the welcome, route, lesson, and playbook at 320px, 390px, and 768px", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await openFresh(page);
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: /Show me the route/i }).click();
    await expectNoHorizontalOverflow(page);
    await page
      .getByRole("button", { name: /See the project beneath the surface/i })
      .click();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: /Begin with the rough idea/i }).click();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: /My playbook/ }).click();
    await expect(
      page.getByRole("dialog", { name: "Your First AI Build Playbook" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Close playbook" }).click();
  }
});
