---
title: Getting Started
description: Install and start using tsd-ui packages.
---

tsd-ui is a collection of reusable UI components, hooks, and utilities extracted from TSD projects, built on top of [PatternFly 6](https://www.patternfly.org/).

## Packages

| Package | Description |
|---------|-------------|
| `@tsd-ui/core` | Shared types, theme primitives, and utilities |
| `@tsd-ui/forms` | Form-oriented wrappers composing core logic with PatternFly |
| `@tsd-ui/table-controls` | Table control contracts and related logic |

## Installation

Install the packages you need:

```bash
npm install @tsd-ui/core
```

Wrapper packages depend on `@tsd-ui/core` and will install it automatically:

```bash
npm install @tsd-ui/forms
# or
npm install @tsd-ui/table-controls
```

## Peer dependencies

All packages require **React 17+**. Wrapper packages also require **PatternFly 6**:

```bash
npm install react react-dom @patternfly/react-core @patternfly/react-icons
```
