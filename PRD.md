# Product Requirements Document: TSD Shared UI Component Library

**Version:** 1.0
**Date:** February 4, 2026
**Author:** TSD Team
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Goals and Non-Goals](#goals-and-non-goals)
3. [User Personas](#user-personas)
4. [Requirements](#requirements)
5. [Architecture](#architecture)
6. [Component Scope](#component-scope)
7. [Technical Decisions](#technical-decisions)
8. [Migration Strategy](#migration-strategy)
9. [Success Metrics](#success-metrics)
10. [Timeline](#timeline)
11. [Risks and Mitigations](#risks-and-mitigations)
12. [Appendix](#appendix)

---

## Executive Summary

### Problem Statement

The Trusted Software Delivery (TSD) organization maintains multiple frontend applications:

- **Trusted Artifact Signer (TAS)** - Code signing management console
- **Trusted Profile Analyzer (TPA)** - SBOM and vulnerability analysis UI
- **Developer Hub (DH)** - Backstage plugins for CI/CD visibility

These projects have evolved independently, resulting in:

1. **Significant code duplication** - FilterToolbar, pagination, table controls, form fields, and notification systems are reimplemented across TAS and TPA
2. **Inconsistent user experience** - Similar functionality behaves differently across products
3. **Maintenance burden** - Bug fixes and improvements must be applied multiple times
4. **Onboarding friction** - Developers must learn different patterns for each project

### Proposed Solution

Create a shared UI component library (`@tsd-ui/*`) that provides:

- Common components extracted from existing TAS and TPA codebases
- Standardized patterns for filtering, tables, forms, and notifications
- Comprehensive documentation via Storybook
- Incremental adoption path for all TSD projects

### Current Technology Landscape

| Project | React | UI Library | State Management | Build Tool |
|---------|-------|------------|------------------|------------|
| TAS Frontend | 19 | PatternFly v6 | React Query v5 | Vite |
| TPA Frontend | 19 | PatternFly v6 | React Query v5 | Rsbuild |
| DH Plugins | 17/18 | MUI v4/v5 + PF6 | Varies | Backstage CLI |

**Key Insight:** TAS and TPA share nearly identical technology stacks, making them ideal candidates for immediate component sharing. DH plugins have mixed UI libraries but the Tekton plugin already uses PatternFly v6.

---

## Goals and Non-Goals

### Goals

1. **Reduce code duplication** by extracting common components into a shared library
2. **Improve consistency** across TSD products with unified component APIs
3. **Accelerate development** by providing ready-to-use, tested components
4. **Establish patterns** for building accessible, performant UIs
5. **Enable gradual adoption** without requiring big-bang migrations
6. **Support multiple consumers** with different build tools (Vite, Rsbuild, Backstage CLI)

### Non-Goals

1. **Replace PatternFly** - This library extends and composes PatternFly, not replaces it
2. **Support non-TSD projects** - Initial scope is internal TSD use only
3. **Create a design system** - Visual design remains PatternFly's responsibility
4. **Mandate immediate adoption** - Teams adopt at their own pace
5. **Support React 16 or below** - Minimum React version is 17

---

## User Personas

### Primary: TSD Frontend Developer

**Profile:** Developer working on TAS, TPA, or DH plugins

**Needs:**
- Quick access to pre-built, tested components
- Clear documentation with usage examples
- TypeScript types for IDE support
- Minimal configuration to get started

**Pain Points:**
- Copying code between repositories
- Discovering existing patterns in other projects
- Maintaining consistency with other TSD UIs

### Secondary: New Team Member

**Profile:** Developer onboarding to a TSD project

**Needs:**
- Single source of truth for UI patterns
- Interactive documentation (Storybook)
- Understanding of component composition

**Pain Points:**
- Learning different patterns per project
- Finding the "right" way to implement features

### Tertiary: QA Engineer

**Profile:** Engineer testing TSD applications

**Needs:**
- Consistent component behavior across products
- Predictable test selectors
- Accessibility compliance

---

## Requirements

### Functional Requirements

#### FR-1: Core Components

The library must provide the following extracted components:

| Component | Source | Priority | Description |
|-----------|--------|----------|-------------|
| FilterToolbar | TAS/TPA | P0 | Composable toolbar with filter controls |
| SimplePagination | TAS/TPA | P0 | Pagination with page size selector |
| LoadingWrapper | TAS/TPA | P0 | Consistent loading states |
| ErrorFallback | TAS/TPA | P0 | Error boundary with retry |
| NotificationContext | TAS/TPA | P1 | Toast notification system |
| PageDrawerContext | TAS/TPA | P1 | Slide-out panel management |
| ConfirmDialog | TAS/TPA | P1 | Confirmation modal pattern |

#### FR-2: Table Controls

| Hook/Component | Source | Priority | Description |
|----------------|--------|----------|-------------|
| useTableControls | TPA | P0 | Unified table state management |
| useLocalTableControls | TPA | P0 | Client-side filtering/sorting |
| useServerTableControls | TPA | P1 | Server-side filtering/sorting |
| TableRowContentWithControls | TPA | P1 | Expandable row pattern |

#### FR-3: Form Components (HookFormPF)

React Hook Form + PatternFly integration:

| Component | Priority | Description |
|-----------|----------|-------------|
| HookFormPFTextInput | P0 | Text input with validation |
| HookFormPFSelect | P0 | Select dropdown |
| HookFormPFGroupController | P1 | Form group wrapper |
| HookFormPFTextArea | P1 | Multi-line text input |

#### FR-4: Utility Hooks

| Hook | Priority | Description |
|------|----------|-------------|
| useLocalStorage | P1 | Persistent local storage |
| useDebounce | P1 | Debounced values |
| useSelectionState | P1 | Multi-select state management |

### Non-Functional Requirements

#### NFR-1: Performance

- Bundle size < 50KB gzipped (core package)
- Tree-shakeable exports
- No runtime CSS-in-JS (use PatternFly CSS)
- Lazy-loadable component packages

#### NFR-2: Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader announcements
- Focus management

#### NFR-3: Compatibility

- React 17, 18, and 19 support
- PatternFly v6 (v5 compatibility layer optional)
- ESM and CommonJS outputs
- TypeScript 5.x

#### NFR-4: Quality

- 80% test coverage minimum
- Storybook stories for all components
- TypeScript strict mode
- ESLint + Prettier enforcement

#### NFR-5: Documentation

- Interactive Storybook deployment
- API reference generated from TSDoc
- Migration guides from existing implementations
- Usage examples for common patterns

---

## Architecture

### Monorepo Structure

```
tsd-ui/
├── packages/
│   ├── core/                 # @tsd-ui/core
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── FilterToolbar/
│   │   │   │   ├── LoadingWrapper/
│   │   │   │   ├── ErrorFallback/
│   │   │   │   └── SimplePagination/
│   │   │   ├── hooks/
│   │   │   │   ├── useLocalStorage.ts
│   │   │   │   └── useDebounce.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── table-controls/       # @tsd-ui/table-controls
│   │   ├── src/
│   │   │   ├── useTableControls.ts
│   │   │   ├── useLocalTableControls.ts
│   │   │   └── useServerTableControls.ts
│   │   └── package.json
│   │
│   ├── forms/                # @tsd-ui/forms
│   │   ├── src/
│   │   │   └── HookFormPF/
│   │   └── package.json
│   │
│   └── notifications/        # @tsd-ui/notifications
│       ├── src/
│       │   ├── NotificationContext.tsx
│       │   └── NotificationProvider.tsx
│       └── package.json
│
├── apps/
│   └── storybook/            # Documentation site
│
├── package.json              # Workspace root
├── pnpm-workspace.yaml
└── turbo.json                # Build orchestration
```

### Package Scoping

| Package | Dependencies | Use Case |
|---------|--------------|----------|
| `@tsd-ui/core` | PatternFly, React | Essential components, no external state libs |
| `@tsd-ui/table-controls` | core | Table state management hooks |
| `@tsd-ui/forms` | core, react-hook-form | Form field integrations |
| `@tsd-ui/notifications` | core | Toast/notification system |

### Dependency Strategy

```
@tsd-ui/core
    └── peerDependencies: react, @patternfly/react-core

@tsd-ui/table-controls
    └── peerDependencies: react, @tsd-ui/core

@tsd-ui/forms
    └── peerDependencies: react, react-hook-form, @tsd-ui/core

@tsd-ui/notifications
    └── peerDependencies: react, @tsd-ui/core
```

---

## Component Scope

### Phase 1: Foundation (Core Package)

Extract and standardize the most duplicated components:

**From TAS/TPA:**
- `FilterToolbar` - Unified API for filter controls
- `SimplePagination` - Page navigation with size selector
- `LoadingWrapper` - Skeleton/spinner states
- `ErrorFallback` - Error boundary with reset

**Utility Hooks:**
- `useLocalStorage` - Type-safe localStorage
- `useDebounce` - Value debouncing

### Phase 2: Table Controls

Extract TPA's table control system (most mature implementation):

- `useTableControls` - Core hook with filtering, sorting, pagination
- `useLocalTableControls` - Client-side data handling
- `useServerTableControls` - Server-side data handling
- `getHubRequestParams` - API parameter builder

### Phase 3: Forms

Extract HookFormPF integration:

- `HookFormPFTextInput`
- `HookFormPFSelect`
- `HookFormPFTextArea`
- `HookFormPFGroupController`

### Phase 4: Extended Components

- `NotificationContext` / `NotificationProvider`
- `PageDrawerContext`
- `ConfirmDialog`
- `KeycloakProvider` (if common auth patterns exist)

---

## Technical Decisions

### Build Tooling

**Selected: tsup**

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| tsup | Fast, zero-config, ESM+CJS | Less control | **Selected** |
| Rollup | Flexible, proven | More config | Considered |
| Vite lib mode | Modern, fast | Extra complexity | Rejected |

**Rationale:** tsup provides the best balance of speed, simplicity, and output format support. It handles ESM/CJS dual output, TypeScript declarations, and tree-shaking out of the box.

### Package Registry

**Selected: GitHub Packages**

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| GitHub Packages | Free, integrated with repos | Requires auth | **Selected** |
| npm public | No auth needed | Public exposure | Rejected |
| Artifactory | Enterprise features | Cost, complexity | Future option |

**Rationale:** GitHub Packages integrates with existing GitHub workflows, provides free hosting for organization packages, and keeps internal code private.

### Documentation

**Selected: Storybook 8**

Features:
- Interactive component playground
- Auto-generated docs from TypeScript
- Accessibility testing addon
- Visual regression testing ready

Deployment: GitHub Pages (free, automated via Actions)

### Testing

**Selected: Vitest + React Testing Library**

| Tool | Purpose |
|------|---------|
| Vitest | Unit tests, fast execution |
| React Testing Library | Component behavior tests |
| Storybook Test | Visual/interaction tests |
| axe-core | Accessibility audits |

### Monorepo Management

**Selected: pnpm + Turborepo**

| Tool | Purpose |
|------|---------|
| pnpm | Fast, efficient dependency management |
| Turborepo | Build caching, task orchestration |
| Changesets | Version management, changelogs |

---

## Migration Strategy

### Approach: Gradual Adoption

The library is designed for incremental adoption without requiring immediate full migration.

### Step 1: Add Dependency

```bash
# TAS/TPA projects
pnpm add @tsd-ui/core

# DH plugins (in plugin directory)
yarn add @tsd-ui/core
```

### Step 2: Import and Replace

```tsx
// Before (local import)
import { FilterToolbar } from '@app/components/FilterToolbar';

// After (library import)
import { FilterToolbar } from '@tsd-ui/core';
```

### Step 3: Deprecate Local Components

```tsx
// src/components/FilterToolbar/index.ts
/**
 * @deprecated Use @tsd-ui/core FilterToolbar instead
 * Migration: https://tsd-ui.github.io/migration/filter-toolbar
 */
export { FilterToolbar } from '@tsd-ui/core';
```

### Step 4: Remove Local Code

Once all usages are migrated, delete local implementations.

### Migration Support

For each component, provide:
1. **Comparison doc** - API differences between local and library versions
2. **Codemods** - Automated transforms where possible
3. **Storybook examples** - Side-by-side comparisons

---

## Success Metrics

### Quantitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Code duplication reduction | 50% fewer duplicate components | LOC comparison |
| Bundle size | < 50KB gzipped (core) | Bundlephobia |
| Test coverage | > 80% | Vitest coverage |
| Adoption rate | 2+ projects using core | Package downloads |
| Documentation coverage | 100% components | Storybook audit |

### Qualitative Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Developer satisfaction | Positive feedback | Team surveys |
| Onboarding time | Reduced ramp-up | New hire feedback |
| Consistency | Unified UX | Design review |

---

## Timeline

### Phase 1: Foundation (Weeks 1-4)

| Week | Milestone |
|------|-----------|
| 1 | Repository setup, CI/CD, Storybook skeleton |
| 2 | Extract FilterToolbar, SimplePagination |
| 3 | Extract LoadingWrapper, ErrorFallback, utility hooks |
| 4 | Documentation, first release (v0.1.0) |

### Phase 2: Table Controls (Weeks 5-8)

| Week | Milestone |
|------|-----------|
| 5-6 | Extract useTableControls family |
| 7 | Integration testing with TPA |
| 8 | Documentation, release (v0.2.0) |

### Phase 3: Forms (Weeks 9-12)

| Week | Milestone |
|------|-----------|
| 9-10 | Extract HookFormPF components |
| 11 | Integration testing |
| 12 | Documentation, release (v0.3.0) |

### Phase 4: Notifications & Polish (Weeks 13-16)

| Week | Milestone |
|------|-----------|
| 13-14 | NotificationContext, PageDrawerContext |
| 15 | Performance optimization, final polish |
| 16 | v1.0.0 release |

---

## Risks and Mitigations

### Risk 1: Version Conflicts

**Risk:** Different projects may require different versions of shared dependencies.

**Mitigation:**
- Use wide peer dependency ranges where possible
- Provide compatibility matrices in documentation
- Use semantic versioning strictly

### Risk 2: Breaking Changes

**Risk:** Library updates could break consuming applications.

**Mitigation:**
- Follow semantic versioning
- Provide deprecation warnings before removal
- Maintain changelog with migration guides
- Consider LTS versions for stability

### Risk 3: Low Adoption

**Risk:** Teams may continue using local implementations.

**Mitigation:**
- Start with highest-value components (FilterToolbar, table controls)
- Provide clear migration paths
- Demonstrate benefits with metrics
- Get buy-in from tech leads

### Risk 4: DH Plugin Compatibility

**Risk:** DH plugins have different UI library (MUI) and React versions.

**Mitigation:**
- Core package has minimal dependencies
- Test with Backstage CLI build process
- Tekton plugin (already PF6) as pilot
- Consider MUI-specific package if needed

### Risk 5: Maintenance Burden

**Risk:** Library becomes another project to maintain.

**Mitigation:**
- Automate releases with Changesets
- Require tests for all contributions
- Rotate maintainership across teams
- Keep scope focused

---

## Appendix

### A. Duplicated Code Analysis

Components found in both TAS and TPA with similar implementations:

| Component | TAS Location | TPA Location | Similarity |
|-----------|--------------|--------------|------------|
| FilterToolbar | `src/app/components/FilterToolbar` | `client/src/app/components/FilterToolbar` | ~85% |
| SimplePagination | `src/app/components/SimplePagination` | `client/src/app/components/SimplePagination` | ~90% |
| LoadingWrapper | `src/app/components/LoadingWrapper.tsx` | `client/src/app/components/LoadingWrapper.tsx` | ~95% |
| useLocalStorage | `src/app/hooks/useLocalStorage.ts` | `client/src/app/hooks/useLocalStorage.ts` | ~80% |

### B. PatternFly v6 Component Usage

Common PatternFly components used across TAS and TPA:

- `@patternfly/react-core`: Button, Card, Modal, TextInput, Select, Toolbar
- `@patternfly/react-table`: Table, Thead, Tbody, Tr, Td, ThProps
- `@patternfly/react-icons`: Various icons

### C. Reference Implementations

**TPA Table Controls:** Most mature implementation of table state management. Located at `client/src/app/hooks/table-controls/`.

**TAS FilterToolbar:** Clean composition pattern for filter controls. Located at `src/app/components/FilterToolbar/`.

### D. Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | TBD | Prioritization, requirements |
| Tech Lead | TBD | Architecture decisions |
| Contributors | TSD Frontend Developers | Implementation |
| Consumers | TAS, TPA, DH Teams | Adoption, feedback |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-04 | TSD Team | Initial draft |
