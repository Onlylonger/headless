# useHover Hook

## Overview

`useHover` is a headless React hook that handles pointer hover interactions for elements. It normalizes hover behavior across different browsers and platforms, and properly handles touch devices by ignoring emulated mouse events.

### Use Cases

- **Interactive UI Elements**: Buttons, cards, menu items that need visual feedback on hover
- **Tooltips**: Show tooltips when hovering over elements
- **Dropdown Menus**: Trigger dropdown menus on hover
- **Image Galleries**: Show additional information or preview on hover
- **Accessibility**: Provide hover state for keyboard navigation support

## Usage Examples

### Basic Usage

```tsx
import { useHover } from '@shilong/headless/hooks';

function Button() {
  const { isHovered, hoverProps } = useHover();

  return (
    <button
      {...hoverProps}
      style={{
        backgroundColor: isHovered ? '#007bff' : '#6c757d',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {isHovered ? 'Hovered!' : 'Hover me'}
    </button>
  );
}
```

### With Callbacks

```tsx
import { useHover } from '@shilong/headless/hooks';

function InteractiveCard() {
  const { isHovered, hoverProps } = useHover({
    onHoverStart: (e) => {
      console.log('Hover started with', e.pointerType);
      // Track analytics
    },
    onHoverEnd: (e) => {
      console.log('Hover ended');
      // Cleanup
    },
    onHoverChange: (isHovered) => {
      console.log('Hover state changed:', isHovered);
    },
  });

  return (
    <div
      {...hoverProps}
      style={{
        padding: '20px',
        border: '2px solid',
        borderColor: isHovered ? '#007bff' : '#dee2e6',
        backgroundColor: isHovered ? '#f8f9fa' : 'white',
        transition: 'all 0.2s',
      }}
    >
      <h3>Card Title</h3>
      <p>Hover state: {isHovered ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Conditional Hover (Disabled State)

```tsx
import { useHover } from '@shilong/headless/hooks';

function DisabledButton({ disabled }: { disabled: boolean }) {
  const { isHovered, hoverProps } = useHover({
    isDisabled: disabled,
  });

  return (
    <button
      {...hoverProps}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor: isHovered && !disabled ? '#007bff' : '#6c757d',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {disabled ? 'Disabled' : 'Click me'}
    </button>
  );
}
```

### Using data-hover Attribute for Styling

```tsx
import { useHover } from '@shilong/headless/hooks'

function StyledButton() {
  const { hoverProps } = useHover()

  return (
    <button
      {...hoverProps}
      className="my-button"
      // data-hover attribute is automatically added
    >
      Hover me
    </button>
  )
}

// CSS
.my-button {
  background-color: #6c757d;
  transition: background-color 0.2s;
}

.my-button[data-hover='true'] {
  background-color: #007bff;
}
```

## Parameters

### UseHoverOptions

```typescript
interface UseHoverOptions {
  onHoverStart?: (e: HoverEvent) => void;
  onHoverChange?: (isHovered: boolean) => void;
  onHoverEnd?: (e: HoverEvent) => void;
  isDisabled?: boolean;
}
```

#### onHoverStart

- **Type**: `(e: HoverEvent) => void`
- **Optional**: Yes
- **Description**: Callback fired when hover starts
- **Event Object**:
  ```typescript
  interface HoverEvent {
    type: 'hoverstart' | 'hoverend';
    target: Element;
    pointerType: 'mouse' | 'touch' | 'pen';
  }
  ```

#### onHoverChange

- **Type**: `(isHovered: boolean) => void`
- **Optional**: Yes
- **Description**: Callback fired whenever hover state changes (both start and end)

#### onHoverEnd

- **Type**: `(e: HoverEvent) => void`
- **Optional**: Yes
- **Description**: Callback fired when hover ends

#### isDisabled

- **Type**: `boolean`
- **Optional**: Yes
- **Default**: `false`
- **Description**: When `true`, hover is disabled and any current hover state is cleared

## Return Value

### UseHoverReturn

```typescript
interface UseHoverReturn {
  isHovered: boolean;
  hoverProps: {
    onPointerEnter: (e: React.PointerEvent) => void;
    onPointerLeave: (e: React.PointerEvent) => void;
    'data-hover': boolean;
  };
}
```

#### isHovered

- **Type**: `boolean`
- **Description**: Current hover state (`true` when element is hovered, `false` otherwise)

#### hoverProps

- **Type**: Object with event handlers and data attribute
- **Description**: Props to spread on the target element
- **Properties**:
  - `onPointerEnter`: Pointer enter event handler
  - `onPointerLeave`: Pointer leave event handler
  - `data-hover`: Boolean attribute for CSS styling (`'true'` or `'false'`)

## Notes

### Browser Support

- **Modern Browsers**: Chrome 55+, Firefox 59+, Safari 13+, Edge 79+
- **Not Supported**: IE 11 and earlier versions
- Uses `PointerEvent` API (no fallback to `MouseEvent`)

### Touch Devices

- **Touch events are ignored**: Hover is not triggered by touch interactions
- **iOS compatibility**: Automatically ignores emulated mouse events after touch
- **Mobile behavior**: On mobile devices, hover typically doesn't apply, which is the expected behavior

### Pointer Types

The hook supports three pointer types:

- `'mouse'`: Mouse or trackpad input
- `'touch'`: Touch input (ignored for hover)
- `'pen'`: Stylus/pen input

### Element Removal

When a hovered element is removed from the DOM, the hook automatically detects this and triggers `onHoverEnd` to clean up the hover state.

### Performance

- Uses `useMemo` to optimize event handlers
- Global listeners are properly cleaned up on unmount
- Minimal re-renders: only updates when hover state actually changes

### Accessibility

- The `data-hover` attribute can be used for styling hover states
- Works with keyboard navigation (when combined with focus management)
- Consider providing alternative interaction methods for touch-only users

## Related Documentation

- [TESTING.md](./TESTING.md) - Testing guide and E2E tests
- [React Aria useHover](https://react-aria.adobe.com/useHover) - Inspiration source
