// Deployment settings. Everything here is PUBLIC: Vite copies VITE_* values into the browser bundle.
// Never put API keys, bot tokens or Google credentials in a VITE_* variable.

/**
 * Public Google Calendar embed link (Google Calendar > Settings > "Integrate calendar" > "Public URL / Embed code",
 * copy the address inside src="..."). Only https://calendar.google.com/calendar/embed... is accepted.
 * Leave empty to hide the Availability section.
 */
export const CALENDAR_EMBED_URL = (() => {
  const raw = (import.meta.env.VITE_GOOGLE_CALENDAR_EMBED_URL ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.hostname !== "calendar.google.com" || !url.pathname.startsWith("/calendar/embed")) return "";
    // Month view, no extra chrome. Timezone matches the business (Philippines).
    url.searchParams.set("mode", "MONTH");
    url.searchParams.set("showTitle", "0");
    url.searchParams.set("showPrint", "0");
    url.searchParams.set("showTabs", "0");
    url.searchParams.set("showCalendars", "0");
    url.searchParams.set("showTz", "0");
    url.searchParams.set("hl", "en");
    if (!url.searchParams.has("ctz")) url.searchParams.set("ctz", "Asia/Manila");
    return url.toString();
  } catch {
    return "";
  }
})();
