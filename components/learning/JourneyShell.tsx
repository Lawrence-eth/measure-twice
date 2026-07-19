"use client";

import { useEffect, useRef, type ReactNode } from "react";

import {
  learningStages,
  type LearningStage,
} from "@/lib/studio-progress";

const stageLabels: Record<LearningStage, string> = {
  idea: "Idea",
  tools: "Tools",
  home: "Project home",
  ask: "Ask AI",
  build: "Build",
  check: "Check",
  live: "Go live",
  improve: "Improve",
};

type JourneyShellProps = {
  currentStage: LearningStage;
  completedStages: readonly LearningStage[];
  children: ReactNode;
  onNavigate: (stage: LearningStage) => void;
  onOpenPlaybook: () => void;
  onRestart: () => void;
};

export function JourneyShell({
  currentStage,
  completedStages,
  children,
  onNavigate,
  onOpenPlaybook,
  onRestart,
}: JourneyShellProps) {
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentButtonRef.current?.scrollIntoView({
      behavior: "auto",
      block: "nearest",
      inline: "center",
    });
  }, [currentStage]);

  return (
    <div className="studio-journey">
      <a className="skip-link" href="#lesson">
        Skip to this lesson
      </a>

      <header className="studio-header studio-header--journey">
        <button
          type="button"
          className="studio-wordmark"
          onClick={() => onNavigate("idea")}
          aria-label="Pentimento, return to the first lesson"
        >
          <span aria-hidden="true">P</span>
          <b>Pentimento</b>
        </button>

        <div className="studio-header__actions">
          <button type="button" onClick={onOpenPlaybook}>
            My playbook
            <span aria-hidden="true">{completedStages.length}</span>
          </button>
          <button type="button" onClick={onRestart}>
            Start over
          </button>
        </div>
      </header>

      <nav className="route-nav" aria-label="Your first AI build route">
        <ol>
          {learningStages.map((stage, index) => {
            const completed = completedStages.includes(stage);
            const current = currentStage === stage;
            const reachable = completed || current;

            return (
              <li
                key={stage}
                className={
                  current
                    ? "route-nav__item route-nav__item--current"
                    : completed
                      ? "route-nav__item route-nav__item--complete"
                      : "route-nav__item"
                }
              >
                <button
                  ref={current ? currentButtonRef : undefined}
                  type="button"
                  aria-label={`${stageLabels[stage]}${
                    current ? ", current" : ""
                  }${completed ? ", completed" : ""
                  }`}
                  aria-current={current ? "step" : undefined}
                  disabled={!reachable}
                  onClick={() => onNavigate(stage)}
                >
                  <span>{index + 1}</span>
                  {stageLabels[stage]}
                  {completed && <i aria-hidden="true">✓</i>}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <main id="lesson" className="studio-lesson" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

export { stageLabels };
