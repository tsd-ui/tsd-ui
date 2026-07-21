export interface ComparatorOptions {
  locale?: string;
  direction?: "asc" | "desc";
  nulls?: "first" | "last";
}

/**
 * Creates a reusable comparator function with baked-in locale, direction,
 * and null-positioning configuration. Uses `Intl.Collator` internally for
 * optimal performance when sorting large arrays.
 */
export const createComparator = (opts: ComparatorOptions = {}) => {
  const { locale = "en", direction = "asc", nulls = "first" } = opts;
  const collator = new Intl.Collator(locale, { numeric: true });
  const dir = direction === "desc" ? -1 : 1;

  return (a: unknown, b: unknown): number => {
    if (a == null && b == null) return 0;
    if (a == null) return nulls === "first" ? -1 : 1;
    if (b == null) return nulls === "first" ? 1 : -1;

    if (typeof a === "number" && typeof b === "number") return (a - b) * dir;
    return collator.compare(String(a), String(b)) * dir;
  };
};
