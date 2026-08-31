/**
 * Stand-in for the per-i18n-bundle `loadLocale.ts` files.
 *
 * Those are empty placeholders in the repo (`/* loadLocale *\/`) that the
 * locale-loader webpack plugin rewrites at build time, so under Jest the
 * `new I18n(loadLocale)` constructor throws "loadLocale must be a function".
 * Unit tests assert on behaviour rather than translated copy, so resolving to
 * an empty bundle is enough — `I18n` then falls back to the `en-US` messages
 * each module already imports directly.
 */
module.exports = async function loadLocale() {
  return {};
};
