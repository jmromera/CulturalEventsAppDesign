import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// The catalogue depends on today's date. Tests run on a fixed day so they give the same result whenever
// they are run: by default the first day of the evaluation window (TEST_TODAY=YYYY-MM-DD overrides it).
const today = process.env.TEST_TODAY ?? "2026-12-20";
vi.useFakeTimers({ toFake: ["Date"] });
vi.setSystemTime(new Date(`${today}T12:00:00`));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
