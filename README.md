# tsd-ui

Shared UI libraries for TSD projects: reusable components and utilities extracted for use across internal apps (for example TPA and TAS), with a long-term goal of upstream alignment with PatternFly-related packages.

## Packages

| Package | Description |
| -------- | ----------- |
| [`@tsd-ui/core`](packages/core) | Shared types, theme context, and headless-oriented building blocks. |
| [`@tsd-ui/forms`](packages/forms) | Form-related wrappers that compose core logic with React / PatternFly patterns. |
| [`@tsd-ui/table-controls`](packages/table-controls) | Table control types and adapters (filtering, sorting, pagination). |

Package boundaries and import rules are documented in [`docs/architecture.md`](docs/architecture.md).

## Requirements

- **Node.js** 20+ (CI also runs on 22 and 24)
- **npm** 10+ (see `packageManager` in root `package.json`)

## Setup

```bash
npm ci
```

## Scripts

Run from the repository root (Turborepo orchestrates packages):

| Command | Purpose |
| -------- | -------- |
| `npm run build` | Build all packages (`tsup` → `dist/`) |
| `npm test` | Run Vitest in all packages |
| `npm run lint` | ESLint across packages |
| `npm run typecheck` | `tsc --noEmit` per package |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

## Product / planning

Feature tracking and acceptance criteria live in [`PRD.json`](PRD.json) (structured feature list with phases and verification steps).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, build, and test on pushes and pull requests to `main`. Dependabot and CodeQL are configured under `.github/`.

## Git hooks

Husky is installed via `npm run prepare`. The **pre-commit** and **pre-push** hooks are currently no-ops (`exit 0`) to keep day-to-day workflows fast; see `.husky/pre-commit` and `.husky/pre-push` for how to re-enable lint-staged, typecheck, build, and tests.

## License

Licensed under the Apache License 2.0. See [`LICENSE`](LICENSE).
