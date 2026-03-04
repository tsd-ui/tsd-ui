/**
 * Forms wrapper layer types.
 *
 * These types extend the core layer with form-specific concerns.
 * This layer MAY reference PatternFly types (peer dependency)
 * but MUST NOT reference app-specific modules.
 */

import type { IPersistenceOptions } from "@tsd-ui/core";

/** Configuration for a form field wrapper component. */
export interface IFormGroupWrapperProps {
  /** Field name used by react-hook-form. */
  name: string;
  /** Label displayed above the field. */
  label?: string;
  /** Helper text displayed below the field. */
  helperText?: string;
  /** Whether the field is required. */
  isRequired?: boolean;
  /** Error message to display. */
  errorMessage?: string;
}

/** Configuration for form state persistence (extends core persistence). */
export interface IFormPersistenceOptions extends IPersistenceOptions {
  /** Whether to restore form values on mount. */
  restoreOnMount?: boolean;
}
