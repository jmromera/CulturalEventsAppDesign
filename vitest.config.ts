import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Separate from vite.config.ts so tests do not load the Figma Make dev plugins.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    setupFiles: ["tests/setup.ts"],
    // Many tests render the whole app; with all files in parallel the first render can pass 5 s on a busy machine.
    testTimeout: 15000,
  },
});
