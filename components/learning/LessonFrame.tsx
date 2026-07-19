import type { ReactNode, RefObject } from "react";

type LessonFrameProps = {
  step: number;
  label: string;
  title: string;
  explanation: string;
  children: ReactNode;
  takeaway?: ReactNode;
  deeper?: ReactNode;
  headingRef?: RefObject<HTMLHeadingElement | null>;
};

export function LessonFrame({
  step,
  label,
  title,
  explanation,
  children,
  takeaway,
  deeper,
  headingRef,
}: LessonFrameProps) {
  return (
    <article className="lesson-frame">
      <header className="lesson-frame__header">
        <p className="studio-kicker">
          Stop {step} of 8 <span aria-hidden="true">/</span> {label}
        </p>
        <h1 ref={headingRef} tabIndex={-1}>
          {title}
        </h1>
        <p>{explanation}</p>
      </header>

      <div className="lesson-frame__activity">{children}</div>

      {takeaway && (
        <aside className="lesson-takeaway" aria-label="Reusable takeaway">
          <span>Added to your playbook</span>
          {takeaway}
        </aside>
      )}

      {deeper && (
        <details className="lesson-depth">
          <summary>Why this matters</summary>
          <div>{deeper}</div>
        </details>
      )}
    </article>
  );
}
