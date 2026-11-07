// Hosts the browser may contact automatically (without the person clicking a link).
// It is empty on purpose: fonts, images and code are self-hosted, so only our own domain is used.
// If a third party is ever added, declare it here AND in the privacy policy; tests and
// scripts/check-external-requests.mjs fail on any undeclared host.
export const DECLARED_THIRD_PARTY_HOSTS: readonly string[] = [];
