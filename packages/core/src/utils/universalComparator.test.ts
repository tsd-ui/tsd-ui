import { describe, it, expect } from "vitest";
import { createComparator } from "./universalComparator";

describe("createComparator", () => {
  describe("defaults (asc, en, nulls first)", () => {
    const cmp = createComparator();

    it("compares numbers arithmetically", () => {
      expect(cmp(1, 2)).toBeLessThan(0);
      expect(cmp(2, 1)).toBeGreaterThan(0);
      expect(cmp(5, 5)).toBe(0);
    });

    it("compares negative numbers", () => {
      expect(cmp(-3, 2)).toBeLessThan(0);
      expect(cmp(0, -1)).toBeGreaterThan(0);
    });

    it("compares strings alphabetically", () => {
      expect(cmp("apple", "banana")).toBeLessThan(0);
      expect(cmp("banana", "apple")).toBeGreaterThan(0);
      expect(cmp("same", "same")).toBe(0);
    });

    it("compares strings with numeric awareness", () => {
      expect(cmp("file2", "file10")).toBeLessThan(0);
      expect(cmp("item10", "item2")).toBeGreaterThan(0);
    });

    it("coerces non-number, non-string values to string", () => {
      expect(cmp(true, false)).toBeGreaterThan(0); // "true" vs "false"
      expect(cmp(false, true)).toBeLessThan(0);
    });

    it("places null before non-null values", () => {
      expect(cmp(null, "hello")).toBeLessThan(0);
      expect(cmp("hello", null)).toBeGreaterThan(0);
    });

    it("places undefined before non-null values", () => {
      expect(cmp(undefined, 42)).toBeLessThan(0);
      expect(cmp(42, undefined)).toBeGreaterThan(0);
    });

    it("treats two nullish values as equal", () => {
      expect(cmp(null, null)).toBe(0);
      expect(cmp(undefined, undefined)).toBe(0);
      expect(cmp(null, undefined)).toBe(0);
    });
  });

  describe("direction: desc", () => {
    const cmp = createComparator({ direction: "desc" });

    it("reverses numeric comparison", () => {
      expect(cmp(1, 2)).toBeGreaterThan(0);
      expect(cmp(2, 1)).toBeLessThan(0);
    });

    it("reverses string comparison", () => {
      expect(cmp("apple", "banana")).toBeGreaterThan(0);
      expect(cmp("banana", "apple")).toBeLessThan(0);
    });
  });

  describe("nulls: last", () => {
    const cmp = createComparator({ nulls: "last" });

    it("places null after non-null values", () => {
      expect(cmp(null, "hello")).toBeGreaterThan(0);
      expect(cmp("hello", null)).toBeLessThan(0);
    });

    it("places undefined after non-null values", () => {
      expect(cmp(undefined, 1)).toBeGreaterThan(0);
      expect(cmp(1, undefined)).toBeLessThan(0);
    });

    it("treats two nullish values as equal", () => {
      expect(cmp(null, undefined)).toBe(0);
    });
  });

  describe("locale option", () => {
    it("respects locale-specific ordering", () => {
      const sv = createComparator({ locale: "sv" });
      // In Swedish, ä sorts after z
      expect(sv("ä", "z")).toBeGreaterThan(0);

      const de = createComparator({ locale: "de" });
      // In German, ä sorts near a (before b)
      expect(de("ä", "b")).toBeLessThan(0);
    });
  });

  describe("sorting arrays", () => {
    it("sorts numbers ascending", () => {
      const cmp = createComparator();
      expect([3, 1, 2].sort(cmp)).toEqual([1, 2, 3]);
    });

    it("sorts numbers descending", () => {
      const cmp = createComparator({ direction: "desc" });
      expect([3, 1, 2].sort(cmp)).toEqual([3, 2, 1]);
    });

    it("sorts strings with numeric awareness", () => {
      const cmp = createComparator();
      expect(["file10", "file2", "file1"].sort(cmp)).toEqual(["file1", "file2", "file10"]);
    });

    it("sorts with nulls first (default)", () => {
      const cmp = createComparator();
      expect([3, null, 1, null, 2].sort(cmp)).toEqual([null, null, 1, 2, 3]);
    });

    it("sorts with nulls last", () => {
      const cmp = createComparator({ nulls: "last" });
      expect([3, null, 1, null, 2].sort(cmp)).toEqual([1, 2, 3, null, null]);
    });
  });
});
