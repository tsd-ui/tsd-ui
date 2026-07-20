---
title: Theme
description: Dark/light theme support with system preference detection for PatternFly 6.
---

The theme system provides dark mode, light mode, and automatic system-preference detection. It integrates with PatternFly 6's theming by toggling the `pf-v6-theme-dark` class on the `<html>` element and updating the `<meta name="theme-color">` tag.

## Architecture

The theme system is composed of three pieces:

| Export | Role |
|--------|------|
| `ThemeProvider` | React context provider — manages the resolved theme state and DOM side effects |
| `ThemeSelector` | Drop-in PatternFly `Select` component for choosing light / dark / system |
| `ThemeContext` | Raw React context — use this when you need to read or control the theme from arbitrary components |

`ThemeProvider` owns the logic. `ThemeSelector` is a convenience UI that consumes it. You can skip `ThemeSelector` entirely and build your own toggle using `ThemeContext`.

## Quick start

```tsx
import { useState } from "react";
import { ThemeProvider, ThemeSelector, type ThemeMode } from "@tsd-ui/core";

function App() {
  const [mode, setMode] = useState<ThemeMode>("system");

  return (
    <ThemeProvider mode={mode} setMode={setMode}>
      <header>
        <ThemeSelector />
      </header>
      {/* your app */}
    </ThemeProvider>
  );
}
```

The provider is intentionally **controlled** — you own the `mode` state. This lets you persist the user's choice anywhere (localStorage, URL params, server-side cookie, etc.) without the theme system dictating a storage strategy.

## ThemeProvider

Wraps your app and provides theme state to all descendants via `ThemeContext`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `ThemeMode` | The current theme selection: `"light"`, `"dark"`, or `"system"`. Invalid values are sanitized to `"system"`. |
| `setMode` | `(value: ThemeMode) => void` | Callback fired when the theme changes. Receives a sanitized value. |
| `children` | `React.ReactNode` | Your application tree. |

### What it does

1. **Resolves the effective theme** — when `mode` is `"system"`, it listens to `window.matchMedia("(prefers-color-scheme: dark)")` and reacts to changes in real time.
2. **Applies PatternFly's dark class** — toggles `pf-v6-theme-dark` on `document.documentElement` so all PF components switch appearance.
3. **Updates `<meta name="theme-color">`** — sets it to `#000000` (dark) or `#ffffff` (light) for browser chrome integration.
4. **Sanitizes inputs** — any invalid `mode` string silently falls back to `"system"`.

### Persisting the user's choice

Because the provider is controlled, persistence is your responsibility. A common pattern with localStorage:

```tsx
function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme");
    return isThemeModeValid(stored ?? "") ? (stored as ThemeMode) : "system";
  });

  const handleSetMode = (value: ThemeMode) => {
    setMode(value);
    localStorage.setItem("theme", value);
  };

  return (
    <ThemeProvider mode={mode} setMode={handleSetMode}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

## ThemeSelector

A pre-built PatternFly 6 `Select` dropdown that lets the user pick between light, dark, and system themes. It reads and writes via `ThemeContext`, so it must be rendered inside a `ThemeProvider`.

### Behavior

- Shows an icon-only `MenuToggle` (sun, moon, or desktop icon depending on the current mode).
- Opens a grouped `Select` with three options, each with an icon and description.
- Has an accessible `aria-label` that includes the current selection.
- Positions the popover to the right with flip and overflow prevention.

### No props

`ThemeSelector` takes no props — it gets everything from context. If you need a different UI, use `ThemeContext` directly:

```tsx
import { useContext } from "react";
import { ThemeContext } from "@tsd-ui/core";

function MyCustomToggle() {
  const { mode, setMode, isDark } = useContext(ThemeContext);
  return (
    <button onClick={() => setMode(isDark ? "light" : "dark")}>
      {isDark ? "Switch to light" : "Switch to dark"}
    </button>
  );
}
```

## ThemeContext

The raw React context. Its value has the shape:

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `ThemeMode` | The sanitized mode selection (`"light"`, `"dark"`, or `"system"`). |
| `setMode` | `(mode: ThemeMode) => void` | Updates the mode. Invalid values are sanitized to `"system"`. |
| `isDark` | `boolean` | The resolved dark state — `true` when `mode` is `"dark"`, or when `mode` is `"system"` and the OS preference is dark. |

Use `isDark` when you need a simple boolean for conditional rendering. Use `mode` when you need to know the user's explicit choice (e.g. to show the correct icon).

## Utilities

### `ThemeMode`

```ts
type ThemeMode = "system" | "light" | "dark";
```

### `THEME_MODES`

Constant object for avoiding magic strings:

```ts
import { THEME_MODES } from "@tsd-ui/core";

THEME_MODES.SYSTEM; // "system"
THEME_MODES.LIGHT;  // "light"
THEME_MODES.DARK;   // "dark"
```

### `isThemeModeValid`

Type guard that narrows a `string` to `ThemeMode`:

```ts
import { isThemeModeValid } from "@tsd-ui/core";

const raw = localStorage.getItem("theme") ?? "";
if (isThemeModeValid(raw)) {
  // raw is ThemeMode here
}
```
