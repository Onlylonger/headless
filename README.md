# @shilong/headless

A headless React library with components and hooks built with Vite 8 (Rolldown-powered) and oxc.

## Features

- 🎯 **Headless Components** - UI-agnostic components that provide functionality without styling
- 🪝 **Custom Hooks** - Reusable hooks for common patterns
- ⚡ **Built with Vite 8** - Powered by Rolldown for maximum build performance (10-30× faster than Rollup)
- 🔧 **oxc Integration** - Powered by oxc for linting, minification, and React transform
- 📦 **TypeScript** - Full TypeScript support with type definitions
- 🎨 **Flexible** - Use your own styling and UI components

## Installation

```bash
pnpm add @shilong/headless
```

## Usage

### Hooks

#### useToggle

A hook for managing boolean toggle state.

```tsx
import { useToggle } from '@shilong/headless';

function MyComponent() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Content</div>}
    </div>
  );
}
```

#### useCounter

A hook for managing counter state with min/max constraints.

```tsx
import { useCounter } from '@shilong/headless';

function MyComponent() {
  const [count, { increment, decrement, reset }] = useCounter({
    initialValue: 0,
    min: 0,
    max: 10,
    step: 1,
  });

  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Components

#### HeadlessToggle

A headless toggle component using render props.

```tsx
import { HeadlessToggle } from '@shilong/headless';

function MyComponent() {
  return (
    <HeadlessToggle>
      {({ isOn, toggle, setOn, setOff }) => (
        <div>
          <button onClick={toggle}>
            {isOn ? 'On' : 'Off'}
          </button>
          <button onClick={setOn}>Turn On</button>
          <button onClick={setOff}>Turn Off</button>
        </div>
      )}
    </HeadlessToggle>
  );
}
```

#### HeadlessCounter

A headless counter component using render props.

```tsx
import { HeadlessCounter } from '@shilong/headless';

function MyComponent() {
  return (
    <HeadlessCounter initialValue={0} min={0} max={10}>
      {({ count, increment, decrement, reset }) => (
        <div>
          <button onClick={decrement}>-</button>
          <span>{count}</span>
          <button onClick={increment}>+</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </HeadlessCounter>
  );
}
```

## Development

```bash
# Install dependencies
pnpm install

# Development mode with watch
pnpm dev

# Build
pnpm build

# Type check
pnpm type-check

# Lint
pnpm lint

# Lint and fix
pnpm lint:fix
```

## Playground

The project includes a playground for testing and demonstrating components and hooks.

```bash
# Start playground development server
pnpm pg:dev

# Build playground for production
pnpm pg:build

# Preview playground build
pnpm pg:preview
```

The playground will be available at `http://localhost:5173` and automatically opens in your browser.

## Requirements

- Node.js 22+
- pnpm

## License

MIT

