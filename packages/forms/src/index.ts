/**
 * @tsd-ui/forms — form components and HookFormPF wrappers.
 *
 * This is the WRAPPER layer for forms: composes @tsd-ui/core logic
 * with PatternFly form components. It MAY depend on PatternFly
 * but MUST NOT depend on app-specific modules.
 */

export type { IFormGroupWrapperProps, IFormPersistenceOptions } from "./types/index";

export function placeholder(): string {
  return "@tsd-ui/forms";
}
