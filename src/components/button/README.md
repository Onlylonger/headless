# Button Component

## Overview

`Button` is a flexible React component that can render as any element or component. It supports loading and disabled states, and automatically handles event prevention when in these states.

### Use Cases

- **Custom Styled Buttons**: Create buttons with your own design system styling
- **Loading States**: Show loading state with automatic disabled behavior
- **Form Buttons**: Submit, reset, and regular button types
- **Custom Elements**: Render as div, anchor, or any custom component
- **Type-Safe Props**: Full TypeScript support with type inference for custom components

## Usage Examples

### Basic Usage

```tsx
import { Button } from '@shilong/headless/components';

function BasicButton() {
  return <Button onClick={() => console.log('clicked')}>Click me</Button>;
}
```

### Loading State

```tsx
import { Button } from '@shilong/headless/components';

function LoadingButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      loading={loading}
      onClick={() => {
        setLoading(true);
        // Simulate async operation
        setTimeout(() => setLoading(false), 2000);
      }}
    >
      {loading ? 'Loading...' : 'Submit'}
    </Button>
  );
}
```

### Disabled State

```tsx
import { Button } from '@shilong/headless/components';

function DisabledButton() {
  return (
    <Button disabled onClick={() => console.log('This will not fire')}>
      Disabled
    </Button>
  );
}
```

### Custom Element

```tsx
import { Button } from '@shilong/headless/components';

function CustomElementButton() {
  return (
    <Button
      as="div"
      onClick={() => console.log('clicked')}
      style={{ cursor: 'pointer' }}
    >
      Custom Element
    </Button>
  );
}
```

### Custom Component with Type Inference

```tsx
import { Button } from '@shilong/headless/components';
import { Link } from 'react-router-dom';

function CustomComponentButton() {
  return (
    <Button as={Link} to="/page" onClick={() => console.log('clicked')}>
      Navigate
    </Button>
  );
}
```

### CSS Styling with data-loading

```tsx
import { Button } from '@shilong/headless/components';

function StyledButton() {
  return (
    <Button loading className="my-button">
      Submit
    </Button>
  );
}
```

```css
.my-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.my-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.my-button[data-loading='true'] {
  position: relative;
}

.my-button[data-loading='true']::after {
  content: '';
  position: absolute;
  /* Loading spinner styles */
}
```

## Parameters

### ButtonProps

```typescript
interface ButtonProps<T extends ElementType = 'button'> {
  as?: T;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}
```

#### as

- **Type**: `T extends ElementType`
- **Required**: No
- **Default**: `'button'`
- **Description**: The element or component to render. Supports type inference for custom components.

#### loading

- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: When `true`, the button will be disabled and have `data-loading="true"` attribute. This prevents all interactions (onClick, onTouch, etc.) just like the native `disabled` attribute.

#### type

- **Type**: `'button' | 'submit' | 'reset'`
- **Required**: No
- **Default**: `'button'`
- **Description**: Button type attribute. Only applies when `as="button"` or `as` is not specified.

#### children

- **Type**: `React.ReactNode`
- **Required**: No
- **Description**: The content to render inside the button.

### Additional Props

All standard HTML button attributes are supported through the `...rest` props, including:

- `disabled` - Native disabled attribute
- `onClick` - Click handler
- `className` - CSS class name
- `style` - Inline styles
- And all other HTML button attributes

## Return Value

The component renders the specified element or component with:

- All passed props spread onto the element
- `disabled` attribute set to `true` when `loading` or `disabled` is `true`
- `data-loading` attribute set to the `loading` value
- `type` attribute when rendering as a button element

## Notes

### Loading State Behavior

- When `loading={true}`, the button automatically sets `disabled={true}`
- This uses the native browser `disabled` attribute, which automatically prevents:
  - Click events (`onClick`)
  - Touch events (`onTouchStart`, `onTouchEnd`, etc.)
  - Mouse events (`onMouseDown`, `onMouseUp`, etc.)
  - Keyboard events
- The `data-loading` attribute is added for CSS styling purposes

### Disabled State

- The `disabled` prop can be passed directly (inherited from HTML button attributes)
- When `disabled={true}` or `loading={true}`, the button is disabled
- Disabled buttons cannot be clicked or interacted with

### Type Inference

- When using `as={CustomComponent}`, TypeScript will automatically infer the props of `CustomComponent`
- This provides full type safety and autocomplete for custom component props
- Example: `<Button as={Link} to="/page" />` will have type checking for `Link` component props

### Custom Elements

- When `as` is a string (e.g., `as="div"`), the component renders as that HTML element
- All standard HTML attributes for that element are supported
- The `disabled` attribute only applies to button elements

### CSS Styling

- Use `data-loading` attribute for styling loading states: `button[data-loading='true']`
- Use `:disabled` pseudo-class for styling disabled states
- The component supports all standard CSS styling approaches

## Related Documentation

- [USECASES.md](./USECASES.md) - Use case scenarios
