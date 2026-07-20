---
title: createComparator
description: Factory for locale-aware, configurable comparator functions.
---

`createComparator` returns a reusable comparator function with baked-in locale, sort direction, and null-positioning. It caches an `Intl.Collator` instance internally, making it significantly faster than per-call `localeCompare` when sorting large arrays.

## Quick start

```ts
import { createComparator } from "@tsd-ui/core";

const cmp = createComparator();
items.toSorted((a, b) => cmp(a.name, b.name));
```

## Signature

```ts
function createComparator(opts?: ComparatorOptions): (a: unknown, b: unknown) => number;
```

## `ComparatorOptions`

```ts
interface ComparatorOptions {
  locale?: string;            // BCP 47 tag, default "en"
  direction?: "asc" | "desc"; // default "asc"
  nulls?: "first" | "last";  // where nullish values sort, default "first"
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `locale` | `"en"` | Locale passed to `Intl.Collator` for string comparison. |
| `direction` | `"asc"` | Sort direction. `"desc"` flips the comparison result. |
| `nulls` | `"first"` | Whether `null`/`undefined` values sort to the beginning or end. |

## Behavior

1. **Both values `null`/`undefined`** → `0`.
2. **One value nullish** → positioned according to `nulls` option.
3. **Both values are numbers** → arithmetic subtraction (`a - b`), multiplied by direction.
4. **Otherwise** → both coerced to string and compared via `Intl.Collator` with `{ numeric: true }`.

Numeric collation means `"item2"` sorts before `"item10"` (by numeric value, not character code).

## Examples

```ts
import { createComparator } from "@tsd-ui/core";

// Default: ascending, English, nulls first
const cmp = createComparator();
["file10", "file2", "file1"].toSorted(cmp);
// → ["file1", "file2", "file10"]

// Descending with nulls last
const desc = createComparator({ direction: "desc", nulls: "last" });
[3, 1, null, 2].toSorted(desc);
// → [3, 2, 1, null]

// Czech locale
const cs = createComparator({ locale: "cs" });
["č", "c", "d"].toSorted(cs);
// → ["c", "č", "d"]

// Sorting objects by a field
const byName = createComparator({ locale: "en" });
users.toSorted((a, b) => byName(a.name, b.name));
```

## Performance

`String.prototype.localeCompare` constructs an internal collator on every call — for N items that means N·log(N) collator constructions. `createComparator` builds the `Intl.Collator` once and reuses it across all comparisons, which is significantly faster for arrays with hundreds or thousands of elements.
