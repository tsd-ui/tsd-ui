# Agent guide — tsd-ui

Use this file (and [`README.md`](README.md)) as the primary on-ramp for automated or human-assisted work in this repository.

## What this repo is

- **npm workspaces** monorepo with **Turborepo** (`turbo.json`).
- Libraries are built with **tsup** (ESM + CJS + types under each package’s `dist/`).
- **TypeScript** in strict mode (`tsconfig.base.json`).
- **Vitest** for unit tests; **ESLint** + **Prettier** for style and static checks.

## Packages and layering

1. **`@tsd-ui/core`** — Foundation: shared types, theme primitives, utilities. Intended direction: minimal surface coupling to any single UI kit; see [`docs/architecture.md`](docs/architecture.md) for the three-layer model and import rules.
2. **`@tsd-ui/forms`** — Depends on `@tsd-ui/core`. Form-oriented wrappers.
3. **`@tsd-ui/table-controls`** — Depends on `@tsd-ui/core`. Table control contracts and related logic.

**Do not** introduce cross-imports between `forms` and `table-controls`, or app-specific modules (`@app/*`, `@tackle-ui/*`) into library code. Boundary expectations are enforced in part by `boundary.test.ts` files under each package.

## Commands (always verify locally)

From repo root:

- `npm ci` — install (CI-style)
- `npm run lint` / `npm run typecheck` / `npm run build` / `npm test`

Turbo task graph: `build` and `typecheck` depend on upstream `build`; `test` depends on `build`.

## Planning source of truth

[`PRD.json`](PRD.json) lists features (ids like `F000`), phases, status, dependencies, acceptance criteria, and files affected. Prefer aligning non-trivial changes with an existing feature or noting a gap in the PRD when appropriate.

## Hooks and CI

- **Husky** pre-commit / pre-push scripts currently **exit immediately**; they do not run lint or tests on every commit/push. Do not assume hooks will catch regressions—run the npm scripts above before finishing work.
- **CI** on `main` runs the full lint → typecheck → build → test pipeline on Node 20, 22, and 24.

## Conventions for changes

- Match existing patterns in the touched package (exports in `package.json`, `tsup.config.ts`, test layout).
- Keep diffs focused; avoid drive-by refactors unrelated to the task.
- After substantive edits, run at least `npm run lint` and `npm test` (or full CI-equivalent commands) when possible.

## Docs for humans and tools

- [`CLAUDE.md`](CLAUDE.md) — Claude / Claude Code–oriented notes.
- [`GEMINI.md`](GEMINI.md) — Gemini-oriented notes.
- Architecture ADR: [`docs/architecture.md`](docs/architecture.md).
