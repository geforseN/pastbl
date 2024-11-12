[![Tests](https://github.com/geforseN/pastbl/actions/workflows/vitest.yml/badge.svg)](https://github.com/geforseN/pastbl/actions/workflows/vitest.yml)
[![End-to-End Tests](https://github.com/geforseN/pastbl/actions/workflows/playwright.yml/badge.svg)](https://github.com/geforseN/pastbl/actions/workflows/playwright.yml)
[![autofix.ci](https://github.com/geforseN/pastbl/actions/workflows/autofix-ci.yml/badge.svg)](https://github.com/geforseN/pastbl/actions/workflows/autofix-ci.yml)
[![Test server api](https://github.com/geforseN/pastbl/actions/workflows/test-api.yml/badge.svg)](https://github.com/geforseN/pastbl/actions/workflows/test-api.yml)
[![codecov](https://codecov.io/gh/geforseN/pastbl/graph/badge.svg?token=B7HBG03DX5)](https://codecov.io/gh/geforseN/pastbl)

## Install dependencies

```bash
pnpm install
```

## Development Server

```bash
pnpm dev
```

## Test

### Test all workspaces
```bash
pnpm test
```

### Coverage all workspaces

```bash
pnpm coverage
```

### Test some workspace
```bash
pnpm test -- --project node
```

### Test some workspaces
```bash
pnpm test -- --project node --project vue
```

## Browser Extension Development Server

```bash
pnpm --filter @pastbl/browser-extension dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
