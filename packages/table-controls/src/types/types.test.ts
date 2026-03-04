import { describe, it, expect, expectTypeOf } from "vitest";
import type { ITableControlsConfig, ITableControlDerivedState } from "./index";
import type { IActiveSortState, IFilterValues, IPaginationState } from "@tsd-ui/core";

describe("table-controls wrapper types", () => {
  describe("ITableControlsConfig", () => {
    it("accepts minimal config", () => {
      const config: ITableControlsConfig<"name" | "status"> = {
        columnKeys: ["name", "status"],
      };
      expect(config.columnKeys).toEqual(["name", "status"]);
      expect(config.initialSort).toBeUndefined();
    });

    it("accepts full config with persistence", () => {
      const config: ITableControlsConfig<"name" | "status"> = {
        columnKeys: ["name", "status"],
        initialSort: { columnKey: "name", direction: "asc" },
        initialFilters: { name: "test" },
        pagination: { initialItemsPerPage: 20 },
        persistence: { persistTo: "urlParams", prefix: "t1" },
      };
      expect(config.initialSort?.direction).toBe("asc");
      expect(config.pagination?.initialItemsPerPage).toBe(20);
    });
  });

  describe("ITableControlDerivedState", () => {
    it("holds composed feature states", () => {
      const state: ITableControlDerivedState<"name" | "age"> = {
        activeSort: { columnKey: "name", direction: "desc" },
        filters: { name: "alice" },
        pagination: { pageNumber: 1, itemsPerPage: 10 },
      };
      expectTypeOf(state.activeSort).toEqualTypeOf<IActiveSortState | null>();
      expectTypeOf(state.filters).toEqualTypeOf<IFilterValues<"name" | "age">>();
      expectTypeOf(state.pagination).toEqualTypeOf<IPaginationState>();
      expect(state.activeSort?.columnKey).toBe("name");
    });
  });
});
