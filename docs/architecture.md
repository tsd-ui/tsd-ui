# ADR-001: Architectural Boundary Definition

**Status:** Accepted
**Date:** 2026-03-04

## Context

tsd-ui extracts reusable UI components from TPA and TAS for shared use across TSD projects, with a potential upstream path to PatternFly `react-component-groups` (or similar). The architecture must enforce clean separation between headless logic and UI-framework-specific wrappers so that:

1. Core logic is testable without any UI framework.
2. PatternFly wrappers can be contributed upstream without carrying app-specific baggage.
3. Consuming apps integrate via adapters rather than forking or monkey-patching.

## Decision

We adopt a **three-layer architecture**:

```
┌─────────────────────────────────────────────┐
│              Consuming Apps                 │
│         (TPA, TAS, future apps)             │
│                                             │
│   Provide: adapters, API clients, routes    │
├─────────────────────────────────────────────┤
│          Wrapper Layer (PF-aware)           │
│                                             │
│   @tsd-ui/forms        Composes core logic  │
│   @tsd-ui/table-controls  with PatternFly  │
│                           components        │
│                                             │
│   MAY import: @patternfly/*, @tsd-ui/core   │
│   MUST NOT import: @app/*, @tackle-ui/*     │
├─────────────────────────────────────────────┤
│             Core Layer (headless)           │
│                                             │
│   @tsd-ui/core                              │
│                                             │
│   Pure logic: hooks, types, utilities       │
│   MAY import: react (hooks only)            │
│   MUST NOT import: @patternfly/*, react-dom,│
│     @tsd-ui/forms, @tsd-ui/table-controls,  │
│     @app/*, @tackle-ui/*                    │
└─────────────────────────────────────────────┘
```

### Layer 1: Core (`@tsd-ui/core`)

The foundation layer containing headless, UI-agnostic logic:

- **Types**: Shared contracts (filter state, sort state, pagination, persistence options, adapter interfaces)
- **Hooks**: State management hooks (`useDebounce`, `usePersistentState`, `useUrlParams`, `useStorage`)
- **Utilities**: Pure functions (`noop`, type guards, etc.)

**Import rules:**

- MAY depend on `react` (for hooks)
- MUST NOT depend on any UI framework (`@patternfly/*`, `react-dom`)
- MUST NOT depend on wrapper packages (`@tsd-ui/forms`, `@tsd-ui/table-controls`)
- MUST NOT depend on app-specific modules (`@app/*`, `@tackle-ui/*`)

**Enforcement:** `packages/core/src/boundary.test.ts` scans all source files and `package.json` for violations.

### Layer 2: Wrappers (`@tsd-ui/forms`, `@tsd-ui/table-controls`)

PatternFly-aware components that compose core logic with PF components:

- **`@tsd-ui/forms`**: HookFormPF wrappers (form group controller, text input, select, textarea)
- **`@tsd-ui/table-controls`**: Table feature hooks (filtering, sorting, pagination) with PF Table integration

**Import rules:**

- MAY depend on `@tsd-ui/core`
- MAY depend on `@patternfly/*` (as peer dependencies)
- MUST NOT depend on each other (forms cannot import table-controls and vice versa)
- MUST NOT depend on app-specific modules (`@app/*`, `@tackle-ui/*`)

**Enforcement:** Each wrapper has its own `boundary.test.ts`.

### Layer 3: App Adapters (consuming apps)

Consuming applications provide the glue between tsd-ui and their specific backends:

- Implement `ITableControlsAdapter` to translate table state to API query params
- Provide routing integration for URL-based state persistence
- Wire form components to their specific validation schemas

**This layer lives in each consuming app, not in tsd-ui.**

## Consequences

### Positive

- Core logic is fully testable without a DOM or PatternFly
- Wrapper components can be contributed to PatternFly without app-specific coupling
- New consuming apps can integrate by implementing adapter interfaces
- Import boundary tests catch violations automatically in CI

### Negative

- Adapter boilerplate required in each consuming app
- Some code may feel duplicated between apps until adapters stabilize

### Risks

- Overly strict boundaries may slow initial extraction; mitigated by starting with types and relaxing constraints only with documented exceptions

## Dependency Graph

```
@tsd-ui/core          (no internal deps)
    ↑
    ├── @tsd-ui/forms          (depends on core)
    ├── @tsd-ui/table-controls (depends on core)
    │
    └── Consuming apps (depend on any/all packages)
```

Wrapper packages MUST NOT depend on each other. This ensures they can be adopted independently and contributed upstream separately.
