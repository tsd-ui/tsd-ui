/**
 * @tsd-ui/core — shared hooks and utilities for TSD UI components.
 *
 * This is the CORE layer: headless, UI-agnostic logic.
 * It MUST NOT depend on any UI framework (PatternFly, react-dom, etc.).
 */

export type {
  KeyWithValueType,
  DisallowCharacters,
  PersistTarget,
  IPersistenceOptions,
  IFeatureState,
  SortDirection,
  IActiveSortState,
  FilterValue,
  IFilterValues,
  IPaginationState,
  ITableControlsAdapter,
} from "./types/index";

export function noop(): void {
  // intentionally empty
}

export * from "./components/Theme";
