import AxeBuilder from "@axe-core/playwright";
import {
  expect,
  test,
  type Locator,
  type Page,
} from "@playwright/test";

test.describe.configure({ timeout: 180_000 });

const STORAGE_KEY = "pentimento-studio-v4";
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const wcagTags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22a",
  "wcag22aa",
] as const;

const questions = {
  idea: /What should a visitor be able to do from start to finish\?/i,
  tools: /Which tradeoff matters more for your first project\?/i,
  projectHome: /Where should the work survive after this chat closes\?/i,
  privateBoundary: /Does this finished page need an AI API key\?/i,
  ask: /What should AI do first\?/i,
  approve: /How much should AI do before you review again\?/i,
  build: /Which action earns the next evidence level\?/i,
  tryContact: /Try the (?:visitor )?contact (?:action|path)/i,
  repair: /What should (?:you do|happen) after the (?:contact action )?fails\?/i,
  checkRetry: /Does the repaired contact path now finish\?/i,
  releaseVersion: /Which version should go live\?/i,
  releaseProof: /Prove the release where a visitor reaches it/i,
  improve: /What changes first\?/i,
} as const;

const checkpointActions = {
  idea: "Keep this V1 boundary",
  tools: "Save this tool route",
  projectHome: "Pin this project home",
  ask: "Approve this work agreement",
  build: "Save this evidenced version",
  check: "Pin the repaired path",
  release: "Record this checked release",
  improve: "Save this source-backed update",
} as const;

type JourneyOptions = {
  checkAxe?: boolean;
  checkViewport?: boolean;
  afterState?: (page: Page, state: string) => Promise<void>;
};

type InteractionCounter = {
  value: number;
};

function choice(container: Locator, name: string | RegExp) {
  return container
    .getByRole("button", { name })
    .or(container.getByRole("radio", { name }))
    .first();
}

function projectCanvas(page: Page) {
  return page.locator(".p4-canvas-mobile .p4-canvas");
}

async function expectAxeClean(page: Page, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([...wcagTags]);
  if (include) builder = builder.include(include);

  const result = await builder.analyze();
  const summary = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(" ")),
  }));

  expect(
    summary,
    `axe violations: ${JSON.stringify(summary, null, 2)}`,
  ).toEqual([]);
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
    `document width ${dimensions.scrollWidth}px should fit ${
      dimensions.clientWidth
    }px; offenders: ${JSON.stringify(dimensions.offenders)}`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

async function expectCurrentHeadingFocused(
  page: Page,
  expectedName: RegExp,
) {
  const heading = page
    .getByRole("main")
    .getByRole("heading", { level: 1, name: expectedName })
    .first();
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
}

async function expectTaskInFirstViewport(
  page: Page,
  task: Locator,
  primaryAction: Locator,
) {
  await expect(task).toBeVisible();
  await expect(primaryAction).toBeVisible();

  const controls =
    (await task.getByRole("button").count()) +
    (await task.getByRole("radio").count());
  expect(
    controls,
    "a core decision should offer no more than three actions",
  ).toBeGreaterThan(0);
  expect(
    controls,
    "a core decision should offer no more than three actions",
  ).toBeLessThanOrEqual(3);

  const [taskBox, actionBox, viewport] = await Promise.all([
    task.boundingBox(),
    primaryAction.boundingBox(),
    page.evaluate(() => ({
      height: window.innerHeight,
      width: window.innerWidth,
    })),
  ]);

  expect(taskBox, "the current task should have a rendered box").not.toBeNull();
  expect(
    actionBox,
    "the current primary action should have a rendered box",
  ).not.toBeNull();
  expect(taskBox!.y, "the task should start inside the viewport").toBeGreaterThanOrEqual(
    -1,
  );
  expect(taskBox!.y, "the task should start inside the viewport").toBeLessThan(
    viewport.height,
  );
  expect(
    actionBox!.y,
    "the primary action should begin in the first viewport or one short scroll below it",
  ).toBeLessThanOrEqual(viewport.height + 96);
  expect(actionBox!.x).toBeGreaterThanOrEqual(-1);
  expect(actionBox!.x + actionBox!.width).toBeLessThanOrEqual(
    viewport.width + 1,
  );
  expect(
    actionBox!.height,
    "the current primary action should provide a practical touch target",
  ).toBeGreaterThanOrEqual(44);

  const wordsBeforeTask = await task.evaluate((element) => {
    const section = element.closest("section");
    if (!section) return Number.POSITIVE_INFINITY;

    const words: string[] = [];
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const parent = node.parentElement;
      if (
        parent &&
        !element.contains(parent) &&
        (node.compareDocumentPosition(element) &
          Node.DOCUMENT_POSITION_FOLLOWING) !==
          0
      ) {
        const styles = getComputedStyle(parent);
        const hiddenDetails =
          parent.closest("details:not([open])") !== null &&
          parent.closest("summary") === null;
        if (
          styles.display !== "none" &&
          styles.visibility !== "hidden" &&
          !hiddenDetails
        ) {
          words.push(node.textContent ?? "");
        }
      }
      node = walker.nextNode();
    }

    return words
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  });

  expect(
    wordsBeforeTask,
    `the stage should explain its stakes without burying the task; found ${wordsBeforeTask} words`,
  ).toBeLessThanOrEqual(95);
}

async function observeState(
  page: Page,
  state: string,
  task: Locator,
  primaryAction: Locator,
  options: JourneyOptions,
) {
  await expect(task).toBeVisible();
  await expect(primaryAction).toBeVisible();
  await expect(
    page.getByRole("main").locator("details.p4-depth[open]"),
  ).toHaveCount(0);
  await expect(
    page.getByRole("main").locator("details.p4-canvas-mobile"),
  ).toHaveAttribute("open", "");

  if (options.checkViewport) {
    await expectTaskInFirstViewport(page, task, primaryAction);
  }
  if (options.checkAxe) {
    await expectAxeClean(page);
  }
  if (options.afterState) {
    await options.afterState(page, state);
  }
}

async function activate(
  control: Locator,
  counter?: InteractionCounter,
) {
  await control.click();
  if (counter) counter.value += 1;
}

async function saveFieldCard(
  page: Page,
  action: (typeof checkpointActions)[keyof typeof checkpointActions],
) {
  const checkpoint = page.locator(".p5-checkpoint");
  await expect(checkpoint).toBeVisible();
  await expect(checkpoint).toContainText(/Build-kit note ready/i);
  await expect(checkpoint.getByRole("heading", { level: 2 })).toBeFocused();
  await checkpoint.getByRole("button", { name: action, exact: true }).click();
}

async function openFresh(page: Page) {
  await page.goto("/");
  const clearMarker = `${STORAGE_KEY}:clear-once`;
  await page.addInitScript(
    ({ key, marker }) => {
      if (window.sessionStorage.getItem(marker) !== "1") return;
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(marker);
    },
    { key: STORAGE_KEY, marker: clearMarker },
  );
  await page.evaluate(
    (marker) => window.sessionStorage.setItem(marker, "1"),
    clearMarker,
  );
  await page.reload();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /AI can make it look finished.*Learn to make it trustworthy/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/15-minute guided practice.*not a coding course.*not another AI builder/i),
  ).toBeVisible();
  await expect(
    page.getByText(
      /direct one fictional website.*rough idea.*checked release.*what to decide.*what to ask AI.*where the work should live.*prove it works/i,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      /reusable first-version brief, tool map, AI work agreement, evidence ladder, and release-and-recovery checklist/i,
    ),
  ).toBeVisible();
  await expect(page.getByText(/15-minute guided practice/i)).toBeVisible();
  await expect(page.getByText(/No coding.*no API key.*nothing real is published/i)).toBeVisible();
}

async function startWithIdea(page: Page) {
  await openFresh(page);
  await page
    .getByRole("button", {
      name: "Start the guided project",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Email the organizer", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reveal what the screen hid", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: /Start with layer 1.*define the promise/i,
    })
    .click();
  await expectCurrentHeadingFocused(page, /Choose one promise you can keep/i);
  await expect(
    page.getByText(/Willow Fix Day.*approved event details.*organizer email.*No one can run bookings or payments/i),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: questions.idea }),
  ).toBeVisible();
}

async function chooseSmallestIdea(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const task = page.getByRole("group", { name: questions.idea });
  const answer = choice(
    task,
    /Read the event details.*email a question/i,
  );
  await observeState(page, "idea", task, answer, options);
  await activate(answer, counter);

  const canvas = projectCanvas(page);
  await expect(canvas).toContainText(/Nearby visitor/i);
  await expect(canvas).toContainText(/approved facts/i);
  await expect(canvas).toContainText(/email a question/i);
  await expect(canvas).toContainText(
    /Not now.*accounts.*booking.*payments.*live availability.*AI advice/i,
  );
  await saveFieldCard(page, checkpointActions.idea);
  await expectCurrentHeadingFocused(page, /Give each tool one job/i);
}

async function chooseRepositoryLane(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const task = page.getByRole("group", { name: questions.tools });
  const answer = choice(
    task,
    /More setup.*clearer files and recoverable history/i,
  );
  await observeState(page, "tools", task, answer, options);
  await activate(answer, counter);

  const canvas = projectCanvas(page);
  await expect(canvas).toContainText(
    /Helps build.*Repository-aware AI workspace.*Saves versions.*Folder \+ Git \+ GitHub copy.*Serves a version.*Web host/is,
  );
  await saveFieldCard(page, checkpointActions.tools);
  await expectCurrentHeadingFocused(page, /Make the work survive/i);
}

async function completeRepositoryHome(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const survivalTask = page.getByRole("group", {
    name: questions.projectHome,
  });
  const survivalAnswer = choice(
    survivalTask,
    /Files in a project folder, with saved history \(Git\) and an online copy \(GitHub\)/i,
  );
  await observeState(
    page,
    "project-home",
    survivalTask,
    survivalAnswer,
    options,
  );
  await activate(survivalAnswer, counter);

  const privateTask = page.getByRole("group", {
    name: questions.privateBoundary,
  });
  const privateAnswer = choice(
    privateTask,
    /No.*page uses approved facts and a normal email link/i,
  );
  await observeState(
    page,
    "project-home-private-boundary",
    privateTask,
    privateAnswer,
    options,
  );
  await activate(privateAnswer, counter);

  const canvas = projectCanvas(page);
  const homeSteps = canvas.locator(".p4-home__step");
  await expect(homeSteps).toHaveText([
    /Home 1.*Project folder/i,
    /Home 2.*Saved history \(Git\)/i,
    /Home 3.*Online copy \(GitHub\)/i,
  ]);
  await expect(canvas.locator(".p4-secret")).toContainText(
    /Approved facts.*normal email link.*no AI API key/i,
  );
  await saveFieldCard(page, checkpointActions.projectHome);
  await expectCurrentHeadingFocused(page, /See the plan first/i);
  const savedChecklist = projectCanvas(page).locator(
    '[aria-label="Project-home checklist"]',
  );
  await expect(savedChecklist.locator("li")).toHaveCount(4);
  await expect(savedChecklist).toContainText(/Saved history \(Git\)/i);
  await expect(savedChecklist).toContainText(/GitHub/i);
  await expect(savedChecklist).toContainText(/Private-key boundary checked/i);
}

async function completeAsk(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const task = page.getByRole("group", { name: questions.ask });
  const answer = choice(
    task,
    /Inspect the project, return a small plan, and stop for approval/i,
  );
  await expect(
    page.getByRole("button", { name: /Approve (?:step|the plan)/i }),
  ).toHaveCount(0);
  await observeState(page, "ask-ai", task, answer, options);
  await activate(answer, counter);

  const plan = page.getByRole("region", {
    name: /AI(?:'s)? three-step plan/i,
  });
  await expect(plan).toBeVisible();
  await expect(plan.getByRole("listitem")).toHaveCount(1);
  await expect(plan.locator("li")).toHaveCount(3);
  await expect(plan).toContainText(/Proposed step 1/i);
  await expect(plan).toContainText(/approved page structure/i);

  const approvalTask = page.getByRole("group", {
    name: questions.approve,
  });
  const approval = choice(
    approvalTask,
    /Approve step one.*review its evidence before step two/i,
  );
  await observeState(
    page,
    "ask-ai-plan-approval",
    approvalTask,
    approval,
    options,
  );
  await activate(approval, counter);

  await expect(projectCanvas(page)).toContainText(/Approved first step/i);
  await saveFieldCard(page, checkpointActions.ask);
  await expectCurrentHeadingFocused(page, /Trust evidence, not.*Done/i);
}

async function completeBuild(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const task = page.getByRole("group", { name: questions.build });
  const answer = choice(
    task,
    /Open the preview and try the visitor path/i,
  );
  await observeState(page, "build", task, answer, options);
  await expect(page.getByText(/Cycle \d+ of 3/i)).toHaveCount(0);
  await expect(page.getByText(/phase \d+ of 5/i)).toHaveCount(0);
  await activate(answer, counter);

  const buildCanvas = projectCanvas(page);
  await expect(
    buildCanvas.locator('[aria-label="The reusable build loop"]'),
  ).toContainText(/Ask.*Inspect.*Run.*Check.*Save/is);
  await expect(
    buildCanvas.getByRole("list", {
      name: /4 of 5 evidence levels earned/i,
      includeHidden: true,
    }),
  ).toContainText(/AI claim.*Files.*Preview.*Human path.*Public path/is);
  await saveFieldCard(page, checkpointActions.build);
  await expectCurrentHeadingFocused(page, /Use it like a visitor/i);
  const record = projectCanvas(page).locator('[aria-label="Saved change record"]');
  await expect(record).toContainText(/Request/i);
  await expect(record).toContainText(/Changed files/i);
  await expect(record).toContainText(/Observed result/i);
  await expect(record).toContainText(/Checks/i);
  await expect(record).toContainText(/Saved version/i);
}

async function completeCheck(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  await expect(
    page.getByText(/inactive email|broken contact|contact does nothing/i),
  ).toHaveCount(0);

  const tryTask = page.getByRole("group", { name: questions.tryContact });
  const tryContact = choice(tryTask, /Email the organizer/i);
  await observeState(page, "check", tryTask, tryContact, options);
  await activate(tryContact, counter);

  const report = page.getByRole("region", { name: /Defect report/i });
  await expect(report).toContainText(/Observed.*nothing happened/is);
  await expect(report).toContainText(/Steps:/i);
  await expect(report).toContainText(/Expected.*approved email target/is);
  await expect(report).toContainText(/Preserve:/i);
  await expect(report).toContainText(/Repeat after repair:/i);

  const repairTask = page.getByRole("group", { name: questions.repair });
  const repair = choice(
    repairTask,
    /Repair only the inactive email link/i,
  );
  await observeState(page, "check-repair", repairTask, repair, options);
  await activate(repair, counter);

  const retryTask = page.getByRole("group", { name: questions.checkRetry });
  const retryContact = choice(retryTask, /Email the organizer/i);
  await observeState(page, "check-retry", retryTask, retryContact, options);
  await expect(projectCanvas(page)).toContainText(/Repair ready.*retry/i);
  await activate(retryContact, counter);

  await expect(projectCanvas(page)).toContainText(
    /Simulated target reached.*Human path.*earned/is,
  );
  await saveFieldCard(page, checkpointActions.check);
  await expectCurrentHeadingFocused(page, /Release what you checked/i);
  await expect(projectCanvas(page)).toContainText(/V4.*checked/is);
  await expect(projectCanvas(page)).toContainText(/human path worked/i);
}

async function completeRelease(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const versionTask = page.getByRole("group", {
    name: questions.releaseVersion,
  });
  const checkedV4 = choice(
    versionTask,
    /V4.*contact repaired.*repeated path passed/i,
  );
  await observeState(
    page,
    "go-live-version",
    versionTask,
    checkedV4,
    options,
  );
  await expect(versionTask).toContainText(
    /V3.*visual review passed.*contact path not run/is,
  );
  await activate(checkedV4, counter);

  const proofTask = page.getByRole("group", {
    name: questions.releaseProof,
  });
  const publicCheck = choice(
    proofTask,
    /Open fresh and repeat the contact path/i,
  );
  await observeState(
    page,
    "go-live-public-proof",
    proofTask,
    publicCheck,
    options,
  );
  await activate(publicCheck, counter);

  const release = projectCanvas(page).locator(".p4-release");
  await expect(release.locator(".p4-release__node.is-reached")).toHaveCount(3);
  await expect(release).toContainText(/Workspace.*Preview.*Live/is);
  await expect(release.locator(".p4-recovery")).toContainText(/Recovery.*V2/is);
  await expect(release.locator(".p4-artifact")).toContainText(
    /V4 selected.*public path worked.*recovery preserved/is,
  );
  await saveFieldCard(page, checkpointActions.release);
  await expectCurrentHeadingFocused(page, /Change one trusted layer/i);
}

async function completeImprove(
  page: Page,
  counter?: InteractionCounter,
  options: JourneyOptions = {},
) {
  const task = page.getByRole("group", { name: questions.improve });
  const sourceFirst = choice(
    task,
    /Update the organizer note, then the page copy/i,
  );
  await observeState(page, "improve", task, sourceFirst, options);
  await activate(sourceFirst, counter);

  await expect(projectCanvas(page)).toContainText(/V5/i);
  await expect(projectCanvas(page)).toContainText(
    /step-free access.*side entrance.*Willow Lane/is,
  );
  await expect(page.locator(".p5-checkpoint")).toContainText(
    /source-backed update card.*source change.*affected checks.*saved version/is,
  );
  await saveFieldCard(page, checkpointActions.improve);
  await expectCurrentHeadingFocused(
    page,
    /guide a project from idea to evidence/i,
  );
}

async function completeCoreJourney(
  page: Page,
  options: JourneyOptions = {},
) {
  const counter = { value: 0 };
  await startWithIdea(page);
  await chooseSmallestIdea(page, counter, options);
  await chooseRepositoryLane(page, counter, options);
  await completeRepositoryHome(page, counter, options);
  await completeAsk(page, counter, options);
  await completeBuild(page, counter, options);
  await completeCheck(page, counter, options);
  await completeRelease(page, counter, options);
  await completeImprove(page, counter, options);
  return counter.value;
}

async function tabTo(page: Page, target: Locator, maximumTabs = 40) {
  for (let index = 0; index < maximumTabs; index += 1) {
    if (await target.evaluate((element) => document.activeElement === element)) {
      return;
    }
    await page.keyboard.press("Tab");
  }
  throw new Error(`Could not reach keyboard target after ${maximumTabs} Tab presses`);
}

async function keyboardActivate(page: Page, target: Locator) {
  await tabTo(page, target);
  await page.keyboard.press("Enter");
}

test("explains why the method matters, reveals the hidden project, and preserves the first consequence", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await openFresh(page);

  await expect(page.locator(".p5-audit")).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Start the guided project",
      exact: true,
    })
    .click();
  const audit = page.locator(".p5-audit");
  await expect(audit).toBeVisible();
  await expect(
    audit.getByRole("button", {
      name: "Email the organizer",
      exact: true,
    }),
  ).toBeVisible();
  await expect(audit).toContainText(/AI says: ready/i);
  await audit
    .getByRole("button", { name: "Email the organizer", exact: true })
    .click();
  await expect(audit).toContainText(/Observed failure/i);
  await expect(audit).toContainText(/preview proved appearance.*click tested behavior/is);
  await audit
    .getByRole("button", { name: "Reveal what the screen hid", exact: true })
    .click();
  await expect(audit.getByRole("listitem")).toHaveCount(4);
  await expect(audit).toContainText(
    /Promise.*Project home.*Evidence.*Release/is,
  );
  await expect(audit).toContainText(
    /screen was only the surface.*control these layers/is,
  );

  await page
    .getByRole("button", { name: "Back to the introduction", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview the four chapters", exact: true })
    .click();
  const overview = page.getByRole("dialog", {
    name: "The whole journey, one decision at a time",
  });
  await expect(overview).toContainText(
    /Four chapters.*supportable, recoverable, checked release.*Nothing here edits files or publishes a real site/is,
  );
  await expect(overview).toContainText(/Shape the promise/i);
  await expect(overview).toContainText(/Ground the work/i);
  await expect(overview).toContainText(/Direct the build/i);
  await expect(overview).toContainText(/Prove the release/i);
  const overviewStart = overview.getByRole("button", {
    name: "Start with the first promise",
  });
  await overviewStart.scrollIntoViewIfNeeded();
  await expect(overviewStart).toBeInViewport();
  await overviewStart.click();
  await expectCurrentHeadingFocused(page, /Choose one promise you can keep/i);

  const task = page.getByRole("group", { name: questions.idea });
  await expect(task.getByRole("button").or(task.getByRole("radio"))).toHaveCount(
    3,
  );
  await expectTaskInFirstViewport(
    page,
    task,
    choice(task, /Read the event details.*email a question/i),
  );
  await expect(
    page.getByText(/AI workspace helps build.*project home remembers/i),
  ).toHaveCount(0);

  await choice(task, /Donate online/i).click();
  await expect(task).toBeVisible();
  await expect(projectCanvas(page)).toContainText(
    /payments.*identity|identity.*payments|payment provider.*receipts/is,
  );
  await expect(projectCanvas(page)).not.toContainText(
    /Nearby visitor.*approved facts.*email a question/is,
  );

  await choice(
    task,
    /Read the event details.*email a question/i,
  ).click();
  await expect(projectCanvas(page)).toContainText(
    /Nearby visitor.*approved facts.*email a question/is,
  );
  await expect(
    page.getByRole("button", {
      name: checkpointActions.idea,
      exact: true,
    }),
  ).toBeVisible();
  await saveFieldCard(page, checkpointActions.idea);
  await expectCurrentHeadingFocused(page, /Give each tool one job/i);
});

for (const lane of [
  {
    name: "repository",
    answer: /More setup.*clearer files and recoverable history/i,
    homeAnswer:
      /Files in a project folder, with saved history \(Git\) and an online copy \(GitHub\)/i,
    route:
      /Helps build.*Repository-aware AI workspace.*Saves versions.*Folder \+ Git \+ GitHub copy.*Serves a version.*Web host/is,
    guidance: /project folder.*saved history.*online copy/is,
  },
  {
    name: "hosted",
    answer: /Faster preview.*more dependence on one service/i,
    homeAnswer:
      /A saved hosted project with versions and (?:a )?(?:GitHub connection|export)/i,
    route:
      /Helps build.*Hosted AI workspace.*Saves versions.*Saved versions \+ connection\/export.*Serves a version.*Host/is,
    guidance:
      /saved hosted project.*versions.*(?:GitHub connection|export)/is,
  },
] as const) {
  test(`${lane.name} tool choice rewires the route and project-home guidance`, async ({
    page,
  }) => {
    await startWithIdea(page);
    await chooseSmallestIdea(page);

    const task = page.getByRole("group", { name: questions.tools });
    await choice(task, lane.answer).click();

    await expect(projectCanvas(page)).toContainText(lane.route);
    await saveFieldCard(page, checkpointActions.tools);
    const homeTask = page.getByRole("group", {
      name: questions.projectHome,
    });
    await expect(homeTask).toContainText(lane.guidance);
    await expect(choice(homeTask, lane.homeAnswer)).toBeVisible();
  });
}

test("completes 13 meaningful decisions and explicitly saves each of eight build-kit notes", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  const interactionCount = await completeCoreJourney(page, {
    checkViewport: true,
  });

  expect(
    interactionCount,
    "the required route should retain thirteen consequential decisions and trials",
  ).toBe(13);

  const habitsDisclosure = page.locator("details.p4-habits-disclosure");
  await expect(habitsDisclosure).not.toHaveAttribute("open", "");
  await expect(
    page.getByText(/Review the four reusable habits/i),
  ).toBeVisible();
  await expect(
    page.getByText(/More setup.*clearer files and recoverable history/i),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Open my build kit",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Shape my own V1 brief", exact: true }),
  ).toBeVisible();
  await page.getByText(/Review the four reusable habits/i).click();
  const habits = page.getByRole("list", { name: /Four durable habits/i });
  await expect(habits.getByRole("listitem")).toHaveCount(4);
  await expect(habitsDisclosure).toHaveAttribute("open", "");

  const main = page.getByRole("main");
  await expect(main.getByRole("textbox")).toHaveCount(0);
  await expect(main.getByRole("heading", { name: /V1 brief workshop/i })).toHaveCount(
    0,
  );
  await expect(main.locator('[aria-label*="Playbook card"]')).toHaveCount(0);

  const completionWords = await main
    .locator(".p4-complete__hero, .p4-complete__actions, .p4-start-today")
    .evaluateAll((elements) =>
      elements
        .map((element) => element.textContent ?? "")
        .join(" ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    );
  expect(
    completionWords,
    "completion should show outcomes and two next actions, not the handbook inline",
  ).toBeLessThanOrEqual(240);
});

test("keeps the build kit available during the journey and returns focus to its opener", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await startWithIdea(page);
  await chooseSmallestIdea(page);

  const opener = page.getByRole("button", {
    name: "Build kit",
    exact: true,
  });
  await expect(opener).toBeVisible();
  await opener.click();

  const dialog = page.getByRole("dialog", {
    name: /Your build kit/i,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/Five reusable milestone guides/i);
  await expect(
    dialog.locator('ol[aria-label="Build kit index"] button'),
  ).toHaveCount(5);
  await expectAxeClean(page, '[role="dialog"]');

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("shows the real three-step AI plan before approval and practices evidence once", async ({
  page,
}) => {
  await startWithIdea(page);
  await chooseSmallestIdea(page);
  await chooseRepositoryLane(page);
  await completeRepositoryHome(page);

  const askTask = page.getByRole("group", { name: questions.ask });
  await expect(
    page.getByRole("button", {
      name: /Approve step one.*review its evidence before step two/i,
    }),
  ).toHaveCount(0);
  await choice(
    askTask,
    /Inspect the project, return a small plan, and stop for approval/i,
  ).click();

  const plan = page.getByRole("region", {
    name: /AI(?:'s)? three-step plan/i,
  });
  await expect(plan.getByRole("listitem")).toHaveCount(1);
  await expect(plan.locator("li")).toHaveCount(3);
  await expect(
    page.getByRole("button", {
      name: /Approve step one.*review its evidence before step two/i,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: /Approve step one.*review its evidence before step two/i,
    })
    .click();

  await expect(page.locator(".p5-checkpoint")).toContainText(
    /work agreement|Approve a shown plan/i,
  );
  await saveFieldCard(page, checkpointActions.ask);
  const buildTask = page.getByRole("group", { name: questions.build });
  await expect(
    buildTask.getByRole("button").or(buildTask.getByRole("radio")),
  ).toHaveCount(3);
  await expect(page.getByText(/Cycle \d+ of 3/i)).toHaveCount(0);
  await expect(page.getByText(/phase \d+ of 5/i)).toHaveCount(0);
});

test("keeps completion concise and opens one build-kit card at a time", async ({
  page,
}) => {
  await completeCoreJourney(page);
  const usesMobilePlaybook = await page.evaluate(() =>
    window.matchMedia("(max-width: 680px)").matches,
  );

  const opener = page.getByRole("button", {
    name: "Open my build kit",
    exact: true,
  });
  await opener.click();

  const dialog = page.getByRole("dialog", {
    name: /Your build kit/i,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  const index = dialog.locator('ol[aria-label="Build kit index"]');
  const cards = index.locator("button");
  await expect(cards).toHaveCount(5);
  await expect(index.locator('button[aria-expanded="true"]')).toHaveCount(0);

  const first = cards.nth(0);
  const second = cards.nth(1);
  const selectedCard = dialog.locator(".p4-guide__card");
  await first.click();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(selectedCard).toBeFocused();
  await expect(
    index.locator('button[aria-expanded="true"]'),
  ).toHaveCount(1);

  if (usesMobilePlaybook) {
    await expect(index).toBeHidden();
    const allMilestones = dialog.getByRole("button", {
      name: /All milestones/i,
    });
    await expect(allMilestones).toBeVisible();
    await allMilestones.click();
    await expect(index).toBeVisible();
    await expect(first).toBeFocused();

    await second.click();
    await expect(index).toBeHidden();
    await expect(selectedCard).toBeFocused();
    await expect(second).toHaveAttribute("aria-expanded", "true");
  } else {
    await expect(index).toBeVisible();
    await second.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(selectedCard).toBeFocused();
    await expect(
      index.locator('button[aria-expanded="true"]'),
    ).toHaveCount(1);
  }
  await expectAxeClean(page, '[role="dialog"]');

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test("turns the V1 brief workshop into a four-step, one-group-at-a-time transfer flow", async ({
  page,
}) => {
  await completeCoreJourney(page);
  const debriefRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/debrief") {
      debriefRequests.push(request.url());
    }
  });

  const opener = page.getByRole("button", {
    name: "Shape my own V1 brief",
    exact: true,
  });
  await opener.click();

  const dialog = page.getByRole("dialog", { name: /V1 brief workshop/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Step 1 of 4/i)).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: /Person and useful result/i }),
  ).toBeFocused();
  await expect(dialog.getByRole("textbox")).toHaveCount(3);
  await dialog.getByLabel(/Who is this for\?/i).fill("A community gardener");
  await dialog
    .getByLabel(/What situation are they in\?/i)
    .fill("They need to find a seed swap this weekend.");
  await dialog
    .getByLabel(/What useful result should they get\?/i)
    .fill("See approved details and contact the host.");
  await dialog.getByRole("button", { name: /Next/i }).click();

  await expect(dialog.getByText(/Step 2 of 4/i)).toBeVisible();
  await expect(
    dialog.getByRole("heading", {
      name: /Complete path and trusted facts/i,
    }),
  ).toBeFocused();
  await expect(dialog.getByRole("textbox")).toHaveCount(2);
  await dialog
    .getByLabel(/What complete path should they finish\?/i)
    .fill("Open the page, check the details, email the host.");
  await dialog
    .getByLabel(/What facts can you trust\?/i)
    .fill("Organizer-approved event notes.");
  await dialog.getByRole("button", { name: /Next/i }).click();

  await expect(dialog.getByText(/Step 3 of 4/i)).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: /Must-have and Not now/i }),
  ).toBeFocused();
  await expect(dialog.getByRole("textbox")).toHaveCount(2);
  await dialog
    .getByLabel(/What must the first version include\?/i)
    .fill("Event facts and one working email.");
  await dialog
    .getByLabel(/What is not now\?/i)
    .fill("Accounts, booking, and payments.");
  await dialog.getByRole("button", { name: /Next/i }).click();

  await expect(dialog.getByText(/Step 4 of 4/i)).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: /Finish line and starter route/i }),
  ).toBeFocused();
  await expect(dialog.getByRole("textbox")).toHaveCount(1);
  await dialog
    .getByLabel(/What proves it is done\?/i)
    .fill("The public contact path works at 390px.");
  await expect(
    dialog.getByRole("group", { name: /Selected tool route/i }),
  ).toContainText(/More setup.*clearer files and recoverable history/i);
  await expectAxeClean(page, '[role="dialog"]');

  await dialog
    .getByRole("button", { name: "Create my V1 brief", exact: true })
    .click();
  await expect(
    dialog.getByRole("heading", { name: /V1 brief ready/i }),
  ).toBeFocused();
  await expect(dialog.locator("pre")).toContainText(/community gardener/i);
  await expect(dialog.locator("pre")).toContainText(
    /STARTER ROUTE: files and saved history/i,
  );
  await expect(
    dialog.getByRole("button", {
      name: /Optional.*get a teaching reflection/i,
    }),
  ).toBeVisible();
  expect(
    debriefRequests,
    "creating the local V1 brief must not call the optional reflection API",
  ).toEqual([]);
});

test("restores the exact v4 route decisions and current approval substep", async ({
  page,
}) => {
  await startWithIdea(page);
  await chooseSmallestIdea(page);
  await chooseRepositoryLane(page);
  await completeRepositoryHome(page);

  const askTask = page.getByRole("group", { name: questions.ask });
  await choice(
    askTask,
    /Inspect the project, return a small plan, and stop for approval/i,
  ).click();

  await expect
    .poll(async () => {
      const raw = await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      );
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      version: 4,
      started: true,
      stage: "ask-ai",
      completedStages: ["idea", "tools", "project-home"],
      ideaChoice: "facts-email",
      toolChoice: "repository",
      projectHomeChoice: "route-home",
      secretChoice: "private-env",
      aiFirstChoice: "inspect-plan",
      planApprovalChoice: null,
    });

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: /Welcome back/i }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Resume (?:at|from) Ask/i })
    .click();

  await expectCurrentHeadingFocused(page, /See the plan first/i);
  await expect(
    page.getByRole("region", { name: /AI(?:'s)? three-step plan/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: /Approve step one.*review its evidence before step two/i,
    }),
  ).toBeVisible();
  await expect(projectCanvas(page)).toContainText(
    /Limited request.*docs\/brief\.md.*three small steps/is,
  );
  await expect(projectCanvas(page)).toContainText(
    /folder.*saved history.*GitHub/is,
  );
});

test("persists the Check repair and requires the real retry before advancing", async ({
  page,
}) => {
  await startWithIdea(page);
  await chooseSmallestIdea(page);
  await chooseRepositoryLane(page);
  await completeRepositoryHome(page);
  await completeAsk(page);
  await completeBuild(page);

  const tryTask = page.getByRole("group", { name: questions.tryContact });
  await choice(tryTask, /Email the organizer/i).click();
  const repairTask = page.getByRole("group", { name: questions.repair });
  await choice(repairTask, /Repair only the inactive email link/i).click();

  await expect
    .poll(async () => {
      const raw = await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      );
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      version: 4,
      stage: "check",
      completedStages: [
        "idea",
        "tools",
        "project-home",
        "ask-ai",
        "build",
      ],
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
      checkRetryChoice: null,
    });

  await page.reload();
  await page.getByRole("button", { name: /Resume at Check/i }).click();

  const retryTask = page.getByRole("group", { name: questions.checkRetry });
  await expect(retryTask).toBeVisible();
  await choice(retryTask, /Email the organizer/i).click();

  await expect(page.locator(".p5-checkpoint")).toContainText(
    /repaired path|Evidence must include the human path/i,
  );
  await saveFieldCard(page, checkpointActions.check);
  await expectCurrentHeadingFocused(page, /Release what you checked/i);
  await expect
    .poll(async () => {
      const raw = await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      );
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      stage: "go-live",
      checkAttemptChoice: "try-contact",
      repairChoice: "bounded-repair",
      checkRetryChoice: "retry-contact",
    });
});

test("traps restart focus, cancels predictably, and clears v4 progress only on confirmation", async ({
  page,
}) => {
  await startWithIdea(page);
  await chooseSmallestIdea(page);

  const usesMobileRestart = await page.evaluate(() =>
    window.matchMedia("(max-width: 680px)").matches,
  );
  const headerOpener = page.locator(".p4-header__actions").getByRole("button", {
    name: "Start over",
    exact: true,
  });
  const routeDialog = page.getByRole("dialog", {
    name: /Your eight-stop route/i,
  });
  let opener = headerOpener;

  if (usesMobileRestart) {
    await page.locator(".p4-header__center").click();
    await expect(routeDialog).toBeVisible();
    opener = routeDialog.getByRole("button", {
      name: "Start over",
      exact: true,
    });
  }

  await expect(opener).toBeVisible();
  await opener.click();

  const dialog = page.getByRole("alertdialog", {
    name: /Start the journey again\?/i,
  });
  const keep = dialog.getByRole("button", { name: /Keep my progress/i });
  const remove = dialog.getByRole("button", {
    name: /Remove progress and restart/i,
  });
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(keep).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(remove).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(keep).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  if (usesMobileRestart) {
    await expect(routeDialog).toBeVisible();
    await expect(
      routeDialog.getByRole("button", { name: /Close route/i }),
    ).toBeFocused();
  } else {
    await expect(opener).toBeFocused();
  }

  await opener.click();
  await remove.click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /AI can make it look finished.*Learn to make it trustworthy/i,
    }),
  ).toBeFocused();
  await expect
    .poll(async () => {
      const raw = await page.evaluate(
        (key) => window.localStorage.getItem(key),
        STORAGE_KEY,
      );
      return raw ? JSON.parse(raw) : null;
    })
    .toMatchObject({
      version: 4,
      started: false,
      stage: "welcome",
      completedStages: [],
      ideaChoice: null,
      toolChoice: null,
    });
});

test("has no automated accessibility violations throughout the core route", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await openFresh(page);
  await expectAxeClean(page);

  const count = await completeCoreJourney(page, { checkAxe: true });
  expect(count).toBe(13);
  await expectAxeClean(page);
});

test("uses adjacent text—not motion—to explain every layer under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize(MOBILE_VIEWPORT);
  await startWithIdea(page);
  await chooseSmallestIdea(page);

  const motion = await page.evaluate(() => {
    const seconds = (value: string) =>
      value.split(",").map((entry) => {
        const part = entry.trim();
        return part.endsWith("ms")
          ? Number.parseFloat(part) / 1000
          : Number.parseFloat(part);
      });

    const offenders = Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const styles = getComputedStyle(element);
        const animations = seconds(styles.animationDuration);
        const transitions = seconds(styles.transitionDuration);
        return (
          (styles.animationName !== "none" &&
            animations.some((duration) => duration > 0.01)) ||
          transitions.some((duration) => duration > 0.01)
        );
      })
      .slice(0, 12)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        className: element.className,
        animation: getComputedStyle(element).animationDuration,
        transition: getComputedStyle(element).transitionDuration,
      }));

    return {
      offenders,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    };
  });

  expect(motion.offenders).toEqual([]);
  expect(motion.scrollBehavior).not.toBe("smooth");
  await expect(projectCanvas(page)).toContainText(
    /Nearby visitor.*approved facts.*email a question/is,
  );
});

test("never overflows at 320, 390, 768, or 1440 pixels across the full route", async ({
  page,
}) => {
  test.setTimeout(300_000);

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({
      width,
      height: width === 1440 ? 900 : 844,
    });
    await openFresh(page);
    await expectNoHorizontalOverflow(page);

    const count = await completeCoreJourney(page, {
      afterState: async (currentPage) => {
        await expectNoHorizontalOverflow(currentPage);
      },
    });
    expect(count).toBe(13);
    await expectNoHorizontalOverflow(page);
  }
});

test("supports the complete core route with keyboard input alone", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await openFresh(page);

  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: "Start the guided project",
      exact: true,
    }),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: "Email the organizer",
      exact: true,
    }),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: "Reveal what the screen hid",
      exact: true,
    }),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: /Start with layer 1.*define the promise/i,
    }),
  );

  const idea = page.getByRole("group", { name: questions.idea });
  await keyboardActivate(
    page,
    choice(idea, /Read the event details.*email a question/i),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.idea,
      exact: true,
    }),
  );

  const tools = page.getByRole("group", { name: questions.tools });
  await keyboardActivate(
    page,
    choice(tools, /More setup.*clearer files and recoverable history/i),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.tools,
      exact: true,
    }),
  );

  const home = page.getByRole("group", { name: questions.projectHome });
  await keyboardActivate(
    page,
    choice(
      home,
      /Files in a project folder, with saved history \(Git\) and an online copy \(GitHub\)/i,
    ),
  );
  const privateBoundary = page.getByRole("group", {
    name: questions.privateBoundary,
  });
  await keyboardActivate(
    page,
    choice(
      privateBoundary,
      /No.*page uses approved facts and a normal email link/i,
    ),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.projectHome,
      exact: true,
    }),
  );

  const ask = page.getByRole("group", { name: questions.ask });
  await keyboardActivate(
    page,
    choice(
      ask,
      /Inspect the project, return a small plan, and stop for approval/i,
    ),
  );
  const approval = page.getByRole("group", { name: questions.approve });
  await keyboardActivate(
    page,
    choice(
      approval,
      /Approve step one.*review its evidence before step two/i,
    ),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.ask,
      exact: true,
    }),
  );

  const build = page.getByRole("group", { name: questions.build });
  await keyboardActivate(
    page,
    choice(
      build,
      /Open the preview and try the visitor path/i,
    ),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.build,
      exact: true,
    }),
  );

  const tryContact = page.getByRole("group", { name: questions.tryContact });
  await keyboardActivate(
    page,
    choice(tryContact, /Email the organizer/i),
  );
  const repair = page.getByRole("group", { name: questions.repair });
  await keyboardActivate(
    page,
    choice(repair, /Repair only the inactive email link/i),
  );
  const retry = page.getByRole("group", { name: questions.checkRetry });
  await keyboardActivate(
    page,
    choice(retry, /Email the organizer/i),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.check,
      exact: true,
    }),
  );

  const releaseVersion = page.getByRole("group", {
    name: questions.releaseVersion,
  });
  await keyboardActivate(
    page,
    choice(
      releaseVersion,
      /V4.*contact repaired.*repeated path passed/i,
    ),
  );
  const releaseProof = page.getByRole("group", {
    name: questions.releaseProof,
  });
  await keyboardActivate(
    page,
    choice(
      releaseProof,
      /Open fresh and repeat the contact path/i,
    ),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.release,
      exact: true,
    }),
  );

  const improve = page.getByRole("group", { name: questions.improve });
  await keyboardActivate(
    page,
    choice(improve, /Update the organizer note, then the page copy/i),
  );
  await keyboardActivate(
    page,
    page.getByRole("button", {
      name: checkpointActions.improve,
      exact: true,
    }),
  );

  await expectCurrentHeadingFocused(
    page,
    /guide a project from idea to evidence/i,
  );
  await expectAxeClean(page);
});
