// Hosts the browser may contact besides our own domain. Fonts, images and code are self-hosted.
// The only exception is the map: OpenStreetMap tiles, loaded ONLY after the person presses "Map"
// or "Show on the map" (declared in the privacy policy and in the CSP img-src).
// Any new third party must be declared here AND in the privacy policy; tests and
// scripts/check-external-requests.mjs fail on any undeclared host.
export const DECLARED_THIRD_PARTY_HOSTS: readonly string[] = ["tile.openstreetmap.org"];

/** Hosts that may only be contacted after an explicit action (never on page load). */
export const ON_DEMAND_HOSTS: readonly string[] = ["tile.openstreetmap.org"];
