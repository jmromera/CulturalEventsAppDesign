// Sets the theme before the first paint so the page does not flash. Loaded as a file because the CSP blocks
// inline scripts. The key must match STORAGE_KEYS.theme in src/data/storage-keys.ts (a test checks it).
(function () {
  var theme = null;
  try {
    theme = window.localStorage.getItem("plan-cerca.theme");
  } catch (error) {
    theme = null;
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0f0f10" : "#ffffff");
})();
