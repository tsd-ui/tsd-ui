# Claude / Claude Code — tsd-ui

## Quick orientation

This is the **tsd-ui** monorepo: npm workspaces + Turborepo, TypeScript libraries under `packages/*`, built with **tsup**, tested with **Vitest**. See [`README.md`](README.md) for install and scripts, and [`AGENTS.md`](AGENTS.md) for layering, boundaries, and workflow expectations.

## Before you finish a task

Run from the repository root (unless the user only touched docs):

```bash
npm run lint && npm run typecheck && npm run build && npm test
```

CI mirrors this on Node 20, 22, and 24 (`.github/workflows/ci.yml`).

## Architecture reminders

- **`@tsd-ui/core`** is the base package; **`@tsd-ui/forms`** and **`@tsd-ui/table-controls`** depend on it only—not on each other.
- Import and dependency rules are specified in [`docs/architecture.md`](docs/architecture.md) and partially enforced by `packages/*/src/boundary.test.ts`.
- [`PRD.json`](PRD.json) describes phased features and acceptance criteria; use it when scoping or justifying larger changes.

## Husky

Pre-commit and pre-push hooks are **disabled** (they `exit 0`). Rely on explicit `npm run` commands rather than assuming git hooks will validate changes.

## License

Apache License 2.0 — see [`LICENSE`](LICENSE).
