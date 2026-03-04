/**
 * Core layer types — UI-agnostic contracts shared across all packages.
 *
 * These types define the boundary between headless logic (core) and
 * UI framework wrappers (forms, table-controls). Core types MUST NOT
 * reference any UI framework (React, PatternFly, etc.) component types.
 */

// -- Utility types ----------------------------------------------------------

/** Extract keys of T whose values extend V. */
export type KeyWithValueType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

/** Disallow specific characters in a string literal type. */
export type DisallowCharacters<
  S extends string,
  Chars extends string,
> = S extends `${string}${Chars}${string}` ? never : S;

// -- Persistence types -------------------------------------------------------

/** Strategy for persisting UI state (URL params, localStorage, sessionStorage). */
export type PersistTarget = "state" | "urlParams" | "localStorage" | "sessionStorage";

/** Configuration for state persistence. */
export interface IPersistenceOptions {
  /** Where to persist the state. Defaults to "state" (in-memory only). */
  persistTo?: PersistTarget;
  /** Key prefix to namespace persisted values. */
  prefix?: string;
}

// -- Table feature state types -----------------------------------------------

/** Generic feature state that all table features extend. */
export interface IFeatureState<TValue> {
  /** Whether this feature is currently active. */
  isEnabled: boolean;
  /** The current value of this feature's state. */
  value: TValue;
}

/** Sort direction. */
export type SortDirection = "asc" | "desc";

/** Active sort column state. */
export interface IActiveSortState {
  columnKey: string;
  direction: SortDirection;
}

/** Filter value — supports both simple string and multi-select. */
export type FilterValue = string | string[];

/** Map of column keys to their active filter values. */
export type IFilterValues<TColumnKey extends string = string> = Partial<
  Record<TColumnKey, FilterValue>
>;

/** Pagination state. */
export interface IPaginationState {
  pageNumber: number;
  itemsPerPage: number;
}

// -- Adapter pattern types ---------------------------------------------------

/**
 * Adapter interface for decoupling data-fetching from table controls.
 * Consuming apps provide an adapter to translate between core state
 * and their specific API query format.
 */
export interface ITableControlsAdapter<TItem, TColumnKey extends string = string> {
  /** Convert filter/sort/pagination state to API request params. */
  getRequestParams: (args: {
    filters: IFilterValues<TColumnKey>;
    activeSort: IActiveSortState | null;
    pagination: IPaginationState;
  }) => Record<string, unknown>;

  /** Total item count (for server-side pagination). */
  totalItemCount: number;

  /** The current page of items. */
  currentPageItems: TItem[];
}
