// Concert data types and validation helpers.

export type Concert = {
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  /** Describes the image for screen readers and search engines. Falls back to a generated description. */
  imageAlt?: string;
  dateISO?: string;
  endDateISO?: string;
};

/** Validates a list of concerts. Anything malformed is dropped. Returns [] if nothing usable. */
export function parseConcerts(data: unknown, limit = 12): Concert[] {
  if (!Array.isArray(data)) return [];
  const str = (v: unknown, max: number) => (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "");
  const iso = (v: unknown) => {
    const d = str(v, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "";
  };
  const out: Concert[] = [];
  for (const c of data) {
    if (!c || typeof c !== "object") continue;
    const r = c as Record<string, unknown>;
    const title = str(r.title, 120);
    const date = str(r.date, 80);
    const location = str(r.location, 120);
    if (!title || !date || !location) continue;
    const image = str(r.image, 500);
    const imageAlt = str(r.imageAlt, 200);
    const dateISO = iso(r.dateISO);
    const endDateISO = iso(r.endDateISO);
    out.push({
      title,
      date,
      location,
      description: str(r.description, 300),
      // https images or same-site paths only (no protocol-relative //host, no http:, no data:/javascript:)
      image: /^https:\/\/[^\s]+$/.test(image) || /^\/(?!\/)[^\s]*$/.test(image) ? image : "",
      ...(imageAlt ? { imageAlt } : {}),
      ...(dateISO ? { dateISO } : {}),
      ...(endDateISO ? { endDateISO } : {}),
    });
    if (out.length >= limit) break;
  }
  return out;
}
