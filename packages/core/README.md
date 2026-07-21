# @tsd-ui/core

Shared types, components, hooks, and utilities — the foundation layer of tsd-ui.

## Installation

```bash
npm install @tsd-ui/core
```

### Peer dependencies

```bash
npm install react react-dom @patternfly/react-core @patternfly/react-icons
```

| Peer | Version |
|------|---------|
| `react` | `^17.0.0` |
| `react-dom` | `^17.0.0` |
| `@patternfly/react-core` | `^6.0.0` |
| `@patternfly/react-icons` | `^6.0.0` |

## Usage

### Theme support

```tsx
import { useState } from "react";
import { ThemeProvider, ThemeSelector } from "@tsd-ui/core";
import type { ThemeMode } from "@tsd-ui/core";

function App() {
  const [mode, setMode] = useState<ThemeMode>("system");
  return (
    <ThemeProvider mode={mode} setMode={setMode}>
      <ThemeSelector />
      {/* your app */}
    </ThemeProvider>
  );
}
```

### Loading state wrapper

```tsx
import { LoadingWrapper } from "@tsd-ui/core";

function UserList({ isFetching, error, data }) {
  return (
    <LoadingWrapper isFetching={isFetching} fetchError={error}>
      <ul>{data?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
    </LoadingWrapper>
  );
}
```

## Docs

Full documentation: [tsd-ui.github.io/tsd-ui](https://tsd-ui.github.io/tsd-ui/)

## License

Apache-2.0
