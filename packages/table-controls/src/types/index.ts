/**
 * Table controls wrapper layer types.
 *
 * These types extend core table types with PatternFly-specific concerns.
 * This layer MAY reference PatternFly types but MUST NOT reference
 * app-specific modules.
 */

import type {
  IActiveSortState,
  IFilterValues,
  IPaginationState,
  IPersistenceOptions,
} from "@tsd-ui/core";

/** Full table controls configuration combining all feature states. */
export interface ITableControlsConfig<TColumnKey extends string = string> {
  /** Column definitions for the table. */
  columnKeys: TColumnKey[];
  /** Sort configuration. */
  initialSort?: IActiveSortState;
  /** Initial filter values. */
  initialFilters?: IFilterValues<TColumnKey>;
  /** Pagination configuration. */
  pagination?: {
    initialItemsPerPage?: number;
  };
  /** State persistence options. */
  persistence?: IPersistenceOptions;
}

/** Props returned by table control hooks for wiring to a PF Table. */
export interface ITableControlDerivedState<TColumnKey extends string = string> {
  activeSort: IActiveSortState | null;
  filters: IFilterValues<TColumnKey>;
  pagination: IPaginationState;
}
