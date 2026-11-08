import { useEffect, type RefObject } from "react";

// Elements reachable with Tab: roving-tabindex items (tabindex="-1") are skipped.
const FOCUSABLE = ["a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])", "[tabindex]"]
  .map((selector) => `${selector}:not([tabindex='-1'])`).join(", ");

/**
 * Modal panel behaviour (WCAG 2.1.2, 2.4.3): while `active`, Tab and Shift+Tab stay inside the panel,
 * Esc closes it, and when it closes focus returns to the element that opened it.
 */
export function useFocusTrap(panel: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void, initialFocus?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active || !panel.current) return;
    const opener = document.activeElement as HTMLElement | null;
    const element = panel.current;
    (initialFocus?.current ?? element.querySelector<HTMLElement>(FOCUSABLE) ?? element).focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); onEscape(); return; }
      if (event.key !== "Tab") return;
      const focusable = [...element.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => !item.closest("[hidden], [inert]"));
      if (!focusable.length) { event.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!element.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
    // onEscape and initialFocus are read when the panel opens; re-running on every render would steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, panel]);
}
