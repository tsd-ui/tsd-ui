import { describe, it, expect, expectTypeOf } from "vitest";
import type {
  KeyWithValueType,
  DisallowCharacters,
  IFeatureState,
  IActiveSortState,
  IFilterValues,
  IPaginationState,
  IPersistenceOptions,
  ITableControlsAdapter,
} from "./index";

describe("core types", () => {
  describe("KeyWithValueType", () => {
    it("extracts keys whose values match the given type", () => {
      interface TestObj {
        name: string;
        age: number;
        email: string;
        count: number;
      }

      type StringKeys = KeyWithValueType<TestObj, string>;
      expectTypeOf<StringKeys>().toEqualTypeOf<"name" | "email">();

      type NumberKeys = KeyWithValueType<TestObj, number>;
      expectTypeOf<NumberKeys>().toEqualTypeOf<"age" | "count">();
    });
  });

  describe("DisallowCharacters", () => {
    it("allows strings without disallowed characters", () => {
      type Clean = DisallowCharacters<"hello", ".">;
      expectTypeOf<Clean>().toEqualTypeOf<"hello">();
    });

    it("produces never for strings containing disallowed characters", () => {
      type Dirty = DisallowCharacters<"hello.world", ".">;
      expectTypeOf<Dirty>().toEqualTypeOf<never>();
    });
  });

  describe("IFeatureState", () => {
    it("accepts a generic value type", () => {
      const state: IFeatureState<string> = {
        isEnabled: true,
        value: "test",
      };
      expect(state.isEnabled).toBe(true);
      expect(state.value).toBe("test");
    });
  });

  describe("IActiveSortState", () => {
    it("constrains direction to asc | desc", () => {
      const sort: IActiveSortState = {
        columnKey: "name",
        direction: "asc",
      };
      expect(sort.direction).toBe("asc");
      expectTypeOf(sort.direction).toEqualTypeOf<"asc" | "desc">();
    });
  });

  describe("IFilterValues", () => {
    it("maps column keys to filter values", () => {
      const filters: IFilterValues<"name" | "status"> = {
        name: "foo",
        status: ["active", "inactive"],
      };
      expect(filters.name).toBe("foo");
      expect(filters.status).toEqual(["active", "inactive"]);
    });
  });

  describe("IPaginationState", () => {
    it("holds page number and items per page", () => {
      const pagination: IPaginationState = {
        pageNumber: 1,
        itemsPerPage: 20,
      };
      expect(pagination.pageNumber).toBe(1);
      expect(pagination.itemsPerPage).toBe(20);
    });
  });

  describe("IPersistenceOptions", () => {
    it("defaults persistTo to undefined (in-memory)", () => {
      const opts: IPersistenceOptions = {};
      expect(opts.persistTo).toBeUndefined();
    });

    it("accepts valid persist targets", () => {
      const opts: IPersistenceOptions = {
        persistTo: "urlParams",
        prefix: "myTable",
      };
      expect(opts.persistTo).toBe("urlParams");
    });
  });

  describe("ITableControlsAdapter", () => {
    it("enforces the adapter contract", () => {
      interface TestItem {
        id: number;
        name: string;
      }

      const adapter: ITableControlsAdapter<TestItem, "id" | "name"> = {
        getRequestParams: ({ filters, activeSort, pagination }) => ({
          filter: filters,
          sort: activeSort,
          page: pagination.pageNumber,
        }),
        totalItemCount: 100,
        currentPageItems: [{ id: 1, name: "test" }],
      };

      expect(adapter.totalItemCount).toBe(100);
      expect(adapter.currentPageItems).toHaveLength(1);

      const params = adapter.getRequestParams({
        filters: { name: "test" },
        activeSort: { columnKey: "name", direction: "asc" },
        pagination: { pageNumber: 1, itemsPerPage: 10 },
      });
      expect(params).toHaveProperty("filter");
    });
  });
});
