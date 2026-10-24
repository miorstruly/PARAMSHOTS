/** Tiny class-name joiner (replaces "@/lib/utils" so no alias setup is needed). */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
