# Gemini — tsd-ui

## Project summary

**tsd-ui** is a TypeScript monorepo (npm workspaces + Turborepo) publishing internal libraries:

- **`@tsd-ui/core`** — Types, theme-related exports, shared utilities.
- **`@tsd-ui/forms`** — Form wrappers (depends on core).
- **`@tsd-ui/table-controls`** — Table control types/adapters (depends on core).

Build: **tsup** per package. Tests: **Vitest**. Lint: **ESLint**; format: **Prettier**.

## Essential references

| File | Use |
| ---- | --- |
| [`README.md`](README.md) | Setup, scripts, package table |
| [`AGENTS.md`](AGENTS.md) | Layering rules, PRD, CI/hooks, change conventions |
| [`docs/architecture.md`](docs/architecture.md) | ADR for package boundaries |
| [`PRD.json`](PRD.json) | Feature phases, status, criteria |

## Validation commands

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm test
```

## Operational notes

- **Git hooks** (Husky) are intentionally no-ops; validation is manual or via CI.
- **CI** runs on `main` for PRs and pushes: lint, typecheck, build, test across Node 20/22/24.

## License

Apache License 2.0 — [`LICENSE`](LICENSE).
