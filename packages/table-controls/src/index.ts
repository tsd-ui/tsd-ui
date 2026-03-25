/**
 * @tsd-ui/table-controls — headless table control hooks and utilities.
 *
 * This is the WRAPPER layer for tables: composes @tsd-ui/core logic
 * with PatternFly table components. It MAY depend on PatternFly
 * but MUST NOT depend on app-specific modules.
 */

export type { ITableControlsConfig, ITableControlDerivedState } from "./types/index";

export function placeholder(): string {
  return "@tsd-ui/table-controls";
}
