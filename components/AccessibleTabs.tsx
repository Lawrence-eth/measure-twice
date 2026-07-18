"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

export type AccessibleTab<TabId extends string = string> = {
  id: TabId;
  label: ReactNode;
  panel: ReactNode;
  disabled?: boolean;
};

type TabListLabelling =
  | { label: string; labelledBy?: never }
  | { label?: never; labelledBy: string };

export type AccessibleTabsProps<TabId extends string = string> = TabListLabelling & {
  tabs: readonly AccessibleTab<TabId>[];
  value: TabId;
  onValueChange: (tabId: TabId) => void;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  className?: string;
  tabListClassName?: string;
  tabClassName?: string | ((tab: AccessibleTab<TabId>, selected: boolean) => string | undefined);
  panelClassName?: string;
  panelTabIndex?: 0 | -1;
};

function classes(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/**
 * Controlled WAI-ARIA tabs with roving focus. In automatic mode, moving focus
 * also selects the tab; manual mode uses the button's native Enter/Space click.
 */
export function AccessibleTabs<TabId extends string>({
  tabs,
  value,
  onValueChange,
  label,
  labelledBy,
  orientation = "horizontal",
  activationMode = "automatic",
  className,
  tabListClassName,
  tabClassName,
  panelClassName,
  panelTabIndex = 0,
}: AccessibleTabsProps<TabId>) {
  const generatedId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabledIndex = tabs.findIndex((tab) => !tab.disabled);
  const selectedIndex = tabs.findIndex((tab) => tab.id === value && !tab.disabled);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex;
  const [rovingIndex, setRovingIndex] = useState(activeIndex);

  useEffect(() => {
    setRovingIndex(activeIndex);
  }, [activeIndex]);

  const tabDomId = (index: number) => `${generatedId}-tab-${index}`;
  const panelDomId = (index: number) => `${generatedId}-panel-${index}`;

  function enabledIndexFrom(start: number, direction: 1 | -1): number {
    if (!tabs.length || firstEnabledIndex < 0) return -1;

    let candidate = start;
    for (let checked = 0; checked < tabs.length; checked += 1) {
      candidate = (candidate + direction + tabs.length) % tabs.length;
      if (!tabs[candidate]?.disabled) return candidate;
    }
    return -1;
  }

  function focusTab(index: number) {
    if (index < 0) return;
    setRovingIndex(index);
    tabRefs.current[index]?.focus();
    const tab = tabs[index];
    if (tab && activationMode === "automatic") onValueChange(tab.id);
  }

  function handleTabKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    const tabList = event.currentTarget.parentElement;
    const rightToLeft = tabList ? window.getComputedStyle(tabList).direction === "rtl" : false;
    let nextIndex = -1;

    if (event.key === "Home") nextIndex = firstEnabledIndex;
    else if (event.key === "End") {
      nextIndex = [...tabs].map((_, itemIndex) => itemIndex).reverse()
        .find((itemIndex) => !tabs[itemIndex]?.disabled) ?? -1;
    } else if (orientation === "horizontal" && event.key === "ArrowRight") {
      nextIndex = enabledIndexFrom(index, rightToLeft ? -1 : 1);
    } else if (orientation === "horizontal" && event.key === "ArrowLeft") {
      nextIndex = enabledIndexFrom(index, rightToLeft ? 1 : -1);
    } else if (orientation === "vertical" && event.key === "ArrowDown") {
      nextIndex = enabledIndexFrom(index, 1);
    } else if (orientation === "vertical" && event.key === "ArrowUp") {
      nextIndex = enabledIndexFrom(index, -1);
    } else {
      return;
    }

    event.preventDefault();
    focusTab(nextIndex);
  }

  if (firstEnabledIndex < 0) return null;

  return (
    <div className={classes("accessible-tabs", className)}>
      <div
        className={classes("view-tabs", tabListClassName)}
        role="tablist"
        aria-label={label}
        aria-labelledby={labelledBy}
        aria-orientation={orientation}
      >
        {tabs.map((tab, index) => {
          const selected = index === activeIndex;
          const resolvedTabClassName = typeof tabClassName === "function"
            ? tabClassName(tab, selected)
            : tabClassName;

          return (
            <button
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={tabDomId(index)}
              type="button"
              role="tab"
              className={classes("accessible-tabs__tab", resolvedTabClassName)}
              aria-selected={selected}
              aria-controls={panelDomId(index)}
              aria-disabled={tab.disabled || undefined}
              tabIndex={index === rovingIndex ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onValueChange(tab.id)}
              onFocus={() => setRovingIndex(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab, index) => {
        const selected = index === activeIndex;
        return (
          <div
            key={tab.id}
            id={panelDomId(index)}
            className={classes("accessible-tabs__panel", panelClassName)}
            role="tabpanel"
            aria-labelledby={tabDomId(index)}
            tabIndex={selected ? panelTabIndex : -1}
            hidden={!selected}
          >
            {tab.panel}
          </div>
        );
      })}
    </div>
  );
}
