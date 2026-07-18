"use client";

import { useId, type ReactNode } from "react";

import type { Choice } from "@/lib/mission";

export type ChoiceReviewStatus = "correct" | "incorrect" | "warning" | "info";

export type ChoiceReview = {
  status: ChoiceReviewStatus;
  message: ReactNode;
};

type GroupLabelling =
  | { legend: ReactNode; groupLabel?: never }
  | { legend?: never; groupLabel: string };

export type RadioCardGroupProps = GroupLabelling & {
  choices: readonly Choice[];
  name: string;
  value?: string;
  onChange: (choiceId: string) => void;
  description?: ReactNode;
  revealDetails?: boolean;
  reviews?: Partial<Record<string, ChoiceReview>>;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  legendClassName?: string;
  descriptionClassName?: string;
  optionsClassName?: string;
  choiceClassName?: string;
};

export type ToggleCardProps = {
  choice: Choice;
  pressed: boolean;
  onPressedChange: (pressed: boolean, choiceId: string) => void;
  revealDetails?: boolean;
  review?: ChoiceReview;
  disabled?: boolean;
  className?: string;
};

function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

function describedBy(...ids: Array<string | false | undefined>): string | undefined {
  const value = ids.filter(Boolean).join(" ");
  return value || undefined;
}

function ReviewMessage({ id, review }: { id: string; review?: ChoiceReview }) {
  if (!review) return null;

  return (
    <small
      id={id}
      className={`choice-card__review choice-card__review--${review.status}`}
      data-review-status={review.status}
    >
      {review.message}
    </small>
  );
}

/**
 * A native radio group presented as selectable cards. Choice explanations can
 * remain hidden until the learner commits by setting revealDetails to false.
 */
export function RadioCardGroup({
  choices,
  name,
  value,
  onChange,
  legend,
  groupLabel,
  description,
  revealDetails = true,
  reviews,
  disabled = false,
  required = false,
  className,
  legendClassName,
  descriptionClassName,
  optionsClassName,
  choiceClassName,
}: RadioCardGroupProps) {
  const generatedId = useId();
  const descriptionId = `${generatedId}-description`;

  return (
    <fieldset
      className={classes("choice-group", className)}
      aria-label={legend === undefined ? groupLabel : undefined}
      aria-describedby={description === undefined ? undefined : descriptionId}
      disabled={disabled}
    >
      {legend !== undefined && <legend className={legendClassName}>{legend}</legend>}
      {description !== undefined && (
        <div id={descriptionId} className={descriptionClassName}>{description}</div>
      )}
      <div className={classes("choice-group__options", optionsClassName)}>
        {choices.map((choice, index) => {
          const inputId = `${generatedId}-choice-${index}`;
          const detailId = `${inputId}-detail`;
          const reviewId = `${inputId}-review`;
          const checked = value === choice.id;
          const review = reviews?.[choice.id];

          return (
            <label
              key={choice.id}
              htmlFor={inputId}
              className={classes(
                "choice-card",
                checked && "choice-card--selected",
                choice.dangerous && "choice-card--danger",
                review && `choice-card--review-${review.status}`,
                choiceClassName,
              )}
              data-choice-id={choice.id}
            >
              <input
                id={inputId}
                className="choice-card__control choice-card__native"
                type="radio"
                name={name}
                value={choice.id}
                checked={checked}
                required={required}
                aria-invalid={review?.status === "incorrect" || undefined}
                aria-describedby={describedBy(
                  revealDetails && choice.detail ? detailId : undefined,
                  review ? reviewId : undefined,
                )}
                onChange={() => onChange(choice.id)}
              />
              <span className="choice-card__body">
                <strong>{choice.title}</strong>
                {revealDetails && choice.detail && <small id={detailId}>{choice.detail}</small>}
                <ReviewMessage id={reviewId} review={review} />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A multi-select card backed by a native button and aria-pressed. */
export function ToggleCard({
  choice,
  pressed,
  onPressedChange,
  revealDetails = true,
  review,
  disabled = false,
  className,
}: ToggleCardProps) {
  const generatedId = useId();
  const detailId = `${generatedId}-detail`;
  const reviewId = `${generatedId}-review`;

  return (
    <button
      type="button"
      className={classes(
        "choice-card",
        pressed && "choice-card--selected",
        choice.dangerous && "choice-card--danger",
        review && `choice-card--review-${review.status}`,
        className,
      )}
      aria-pressed={pressed}
      aria-invalid={review?.status === "incorrect" || undefined}
      aria-describedby={describedBy(
        revealDetails && choice.detail ? detailId : undefined,
        review ? reviewId : undefined,
      )}
      disabled={disabled}
      data-choice-id={choice.id}
      onClick={() => onPressedChange(!pressed, choice.id)}
    >
      <span className="choice-card__control" aria-hidden="true">{pressed ? "✓" : "+"}</span>
      <span className="choice-card__body">
        <strong>{choice.title}</strong>
        {revealDetails && choice.detail && <small id={detailId}>{choice.detail}</small>}
        <ReviewMessage id={reviewId} review={review} />
      </span>
    </button>
  );
}
