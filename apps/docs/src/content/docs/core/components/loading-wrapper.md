---
title: LoadingWrapper
description: Declarative async state handler — loading spinner, error state, or content.
---

`LoadingWrapper` is a generic component that renders one of three states based on async operation status: a loading indicator, an error state, or the success content. It removes the repetitive `if (loading) … else if (error) …` pattern from every data-fetching component.

## Quick start

```tsx
import { LoadingWrapper } from "@tsd-ui/core";

function UserList() {
  const { data, isFetching, error } = useQuery(/* ... */);

  return (
    <LoadingWrapper isFetching={isFetching} fetchError={error}>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </LoadingWrapper>
  );
}
```

When `isFetching` is `true`, a centered PatternFly `Spinner` is shown. When `fetchError` is truthy, a default error `EmptyState` is shown. Otherwise, `children` are rendered.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isFetching` | `boolean` | — | Whether data is currently loading. Takes priority over `fetchError`. |
| `fetchError` | `TError \| null \| undefined` | `undefined` | The error object, if any. Rendered when `isFetching` is `false` and this is truthy. |
| `isFetchingState` | `React.ReactNode` | Centered `Spinner` | Custom loading indicator to replace the default spinner. |
| `fetchErrorState` | `(error: TError) => React.ReactNode` | `DefaultErrorState` | Render function for custom error UI. Receives the typed error. |
| `children` | `React.ReactNode` | — | The success content, rendered when not loading and no error. |

## Generic error typing

`LoadingWrapper` is generic over the error type. TypeScript infers `TError` from `fetchError`, so your `fetchErrorState` callback gets the correct type:

```tsx
interface ApiError {
  status: number;
  message: string;
}

<LoadingWrapper<ApiError>
  isFetching={isFetching}
  fetchError={error}
  fetchErrorState={(err) => (
    // err is ApiError here
    <Alert variant="danger" title={`${err.status}: ${err.message}`} />
  )}
>
  <Content />
</LoadingWrapper>
```

## Evaluation order

The component evaluates state top-down with this priority:

1. **`isFetching` is `true`** → render `isFetchingState` (or default spinner)
2. **`fetchError` is truthy** → render `fetchErrorState(error)` (or default error state)
3. **Otherwise** → render `children`

This means loading always wins. If you're refetching in the background and want to show stale data instead of a spinner, pass `isFetching={false}` during refetches.

## Default states

### Loading (default)

A PatternFly `Spinner` centered with `Bullseye`:

```tsx
<Bullseye>
  <Spinner />
</Bullseye>
```

### Error (default)

A PatternFly `EmptyState` with danger styling:

- Icon: `ExclamationCircleIcon`
- Title: "Unable to connect"
- Body: "There was an error retrieving data. Check your connection and try again."
- Variant: `sm`

## Custom loading state

Replace the spinner with a skeleton, a progress bar, or anything else:

```tsx
<LoadingWrapper
  isFetching={isFetching}
  fetchError={error}
  isFetchingState={<Skeleton screenreaderText="Loading data..." />}
>
  <Content />
</LoadingWrapper>
```

## Custom error state

Provide a render function to access the error object and build a contextual error UI:

```tsx
<LoadingWrapper
  isFetching={isFetching}
  fetchError={error}
  fetchErrorState={(err) => (
    <EmptyState
      status="danger"
      titleText={err.message}
      icon={ExclamationTriangleIcon}
    >
      <EmptyStateBody>
        <Button variant="link" onClick={retry}>Try again</Button>
      </EmptyStateBody>
    </EmptyState>
  )}
>
  <Content />
</LoadingWrapper>
```

## Nested wrappers

For pages that fetch multiple independent resources, nest wrappers so each section handles its own async state:

```tsx
function Dashboard() {
  const users = useQuery(/* users */);
  const stats = useQuery(/* stats */);

  return (
    <Grid>
      <GridItem>
        <LoadingWrapper isFetching={users.isFetching} fetchError={users.error}>
          <UserTable data={users.data} />
        </LoadingWrapper>
      </GridItem>
      <GridItem>
        <LoadingWrapper isFetching={stats.isFetching} fetchError={stats.error}>
          <StatsPanel data={stats.data} />
        </LoadingWrapper>
      </GridItem>
    </Grid>
  );
}
```
