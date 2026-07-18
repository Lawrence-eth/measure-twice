"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

export type DialogDismissReason = "escape" | "backdrop";

export type AccessibleDialogProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onDismiss: (reason: DialogDismissReason) => void;
  description?: ReactNode;
  role?: "dialog" | "alertdialog";
  titleAs?: "h1" | "h2" | "h3";
  dismissOnEscape?: boolean;
  dismissOnBackdrop?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  appRootRef?: RefObject<HTMLElement | null>;
  backdropClassName?: string;
  dialogClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  ariaBusy?: boolean;
  testId?: string;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let bodyLockCount = 0;
let originalBodyOverflow = "";
let originalBodyPaddingRight = "";

type HiddenRootState = {
  count: number;
  hadInert: boolean;
  ariaHidden: string | null;
};

const hiddenRoots = new WeakMap<HTMLElement, HiddenRootState>();

function lockDocumentScroll(): () => void {
  const body = document.body;

  if (bodyLockCount === 0) {
    originalBodyOverflow = body.style.overflow;
    originalBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    body.style.overflow = "hidden";
  }

  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);
    if (bodyLockCount !== 0) return;

    body.style.overflow = originalBodyOverflow;
    body.style.paddingRight = originalBodyPaddingRight;
  };
}

function hideApplicationRoot(root: HTMLElement): () => void {
  const existing = hiddenRoots.get(root);

  if (existing) {
    existing.count += 1;
  } else {
    hiddenRoots.set(root, {
      count: 1,
      hadInert: root.hasAttribute("inert"),
      ariaHidden: root.getAttribute("aria-hidden"),
    });
    root.setAttribute("inert", "");
    root.setAttribute("aria-hidden", "true");
  }

  return () => {
    const current = hiddenRoots.get(root);
    if (!current) return;

    current.count -= 1;
    if (current.count > 0) return;

    if (current.hadInert) root.setAttribute("inert", "");
    else root.removeAttribute("inert");

    if (current.ariaHidden === null) root.removeAttribute("aria-hidden");
    else root.setAttribute("aria-hidden", current.ariaHidden);

    hiddenRoots.delete(root);
  };
}

function isFocusable(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return (
    !element.hasAttribute("disabled") &&
    element.getAttribute("aria-hidden") !== "true" &&
    !element.closest("[inert]") &&
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.getClientRects().length > 0
  );
}

function focusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable);
}

function preferredFocusTarget(
  dialog: HTMLElement,
  initialFocusRef?: RefObject<HTMLElement | null>,
): HTMLElement {
  const requested = initialFocusRef?.current;
  if (requested && dialog.contains(requested) && isFocusable(requested)) return requested;
  return focusableElements(dialog)[0] ?? dialog;
}

/**
 * A dependency-free modal foundation. The component portals to document.body,
 * so appRootRef should point to the application content that sits behind it
 * (never document.body). Visual layout is intentionally supplied by the caller.
 */
export function AccessibleDialog({
  open,
  title,
  children,
  onDismiss,
  description,
  role = "dialog",
  titleAs = "h2",
  dismissOnEscape = true,
  dismissOnBackdrop = true,
  restoreFocus = true,
  initialFocusRef,
  returnFocusRef,
  appRootRef,
  backdropClassName,
  dialogClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
  ariaBusy,
  testId,
}: AccessibleDialogProps) {
  const [portalReady, setPortalReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedInsideRef = useRef<HTMLElement | null>(null);
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;
  const Title = titleAs;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open || !portalReady) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const requestedReturnTarget = returnFocusRef?.current ?? null;
    const focusTarget = preferredFocusTarget(dialog, initialFocusRef);
    focusTarget.focus({ preventScroll: true });
    lastFocusedInsideRef.current = focusTarget;

    const unlockScroll = lockDocumentScroll();
    const appRoot = appRootRef?.current;
    const restoreApplicationRoot = appRoot && appRoot !== document.body && !appRoot.contains(dialog)
      ? hideApplicationRoot(appRoot)
      : () => undefined;

    const containProgrammaticFocus = (event: FocusEvent) => {
      const nextTarget = event.target;
      if (!(nextTarget instanceof Node) || dialog.contains(nextTarget)) {
        if (nextTarget instanceof HTMLElement) lastFocusedInsideRef.current = nextTarget;
        return;
      }

      const fallback = lastFocusedInsideRef.current && isFocusable(lastFocusedInsideRef.current)
        ? lastFocusedInsideRef.current
        : preferredFocusTarget(dialog, initialFocusRef);
      fallback.focus({ preventScroll: true });
    };

    document.addEventListener("focusin", containProgrammaticFocus);

    return () => {
      document.removeEventListener("focusin", containProgrammaticFocus);
      restoreApplicationRoot();
      unlockScroll();
      lastFocusedInsideRef.current = null;

      if (!restoreFocus) return;
      const returnTarget = requestedReturnTarget ?? previouslyFocused;
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
    };
  }, [
    appRootRef,
    initialFocusRef,
    open,
    portalReady,
    restoreFocus,
    returnFocusRef,
  ]);

  if (!open || !portalReady) return null;

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (dismissOnEscape) onDismiss("escape");
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = focusableElements(dialog);
    if (focusable.length === 0) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === dialog || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div
      className={backdropClassName}
      data-accessible-dialog-backdrop=""
      onPointerDown={(event) => {
        if (event.target === event.currentTarget && dismissOnBackdrop) onDismiss("backdrop");
      }}
    >
      <div
        ref={dialogRef}
        className={dialogClassName}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description === undefined ? undefined : descriptionId}
        aria-busy={ariaBusy || undefined}
        tabIndex={-1}
        data-testid={testId}
        onKeyDown={handleKeyDown}
      >
        <Title id={titleId} className={titleClassName}>{title}</Title>
        {description !== undefined && (
          <div id={descriptionId} className={descriptionClassName}>{description}</div>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
