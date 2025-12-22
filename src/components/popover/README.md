# Popover

A headless popover component with flexible positioning powered by mini-floating-ui.

## Overview

The Popover component provides a flexible way to display floating content relative to a reference element. It uses a lightweight positioning system (mini-floating-ui) that automatically calculates optimal placement and handles viewport boundaries.

**Use case scenarios:**
- Tooltips that appear on hover or focus
- Dropdown menus triggered by button clicks
- Context menus for right-click actions
- Popovers with rich content (forms, lists, etc.)
- Any floating UI that needs to be positioned relative to another element

## Usage Examples

### Basic Popover

```tsx
import { Popover } from '@shilong/headless'
import { Button } from '@shilong/headless'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      content={<div>Popover content</div>}
    >
      <Button onClick={() => setOpen(!open)}>Toggle Popover</Button>
    </Popover>
  )
}
```

### With Placement

```tsx
<Popover
  open={open}
  onOpenChange={setOpen}
  placement="top"
  content={<div>Appears above the button</div>}
>
  <Button>Hover me</Button>
</Popover>
```

### With Arrow

```tsx
<Popover
  open={open}
  onOpenChange={setOpen}
  showArrow
  content={<div>Popover with arrow</div>}
>
  <Button>Show Popover</Button>
</Popover>
```

### Custom Offset

```tsx
<Popover
  open={open}
  onOpenChange={setOpen}
  offset={16}
  content={<div>With custom spacing</div>}
>
  <Button>Custom Offset</Button>
</Popover>
```

## Parameters

### PopoverProps

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the popover is open |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `placement` | `Placement` | `'bottom'` | Placement of the popover relative to reference element |
| `offset` | `number` | `8` | Distance in pixels between reference and floating element |
| `strategy` | `'absolute' \| 'fixed'` | `'fixed'` | Positioning strategy |
| `children` | `React.ReactElement` | - | Reference element (trigger) |
| `content` | `React.ReactNode` | - | Content to display in the popover |
| `showArrow` | `boolean` | `false` | Whether to show an arrow pointing to the reference element |

### Placement Types

- `'top'` | `'top-start'` | `'top-end'`
- `'bottom'` | `'bottom-start'` | `'bottom-end'`
- `'left'` | `'left-start'` | `'left-end'`
- `'right'` | `'right-start'` | `'right-end'`

## Return Value

The Popover component renders:
- The reference element (children) with attached positioning logic
- The floating content when `open` is `true`

## Notes

### Positioning System

The Popover uses a lightweight positioning system (mini-floating-ui) that:
- Automatically calculates optimal placement
- Handles viewport boundaries with flip and shift middleware
- Updates position on scroll and resize
- Supports both `absolute` and `fixed` positioning strategies

### Middleware

The positioning system includes two built-in middleware:
- **Flip**: Automatically flips the popover to the opposite side if it doesn't fit
- **Shift**: Keeps the popover within viewport boundaries

### Performance

- Uses `getBoundingClientRect()` for accurate positioning
- Updates position on scroll and resize events
- Can be optimized with custom `whileElementsMounted` callback

### Accessibility

- The floating element has `role="tooltip"` by default
- Consider adding proper ARIA attributes based on your use case
- Ensure keyboard navigation is handled appropriately

### Styling

The Popover component is headless and doesn't include any default styles. You should style the content yourself:

```tsx
<Popover
  open={open}
  content={
    <div style={{
      padding: '12px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      Styled content
    </div>
  }
>
  <Button>Styled Popover</Button>
</Popover>
```

