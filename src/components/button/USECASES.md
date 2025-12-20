# Button Use Cases

This document describes the use case scenarios for the `Button` component from a user perspective, focusing on when and why to use it rather than implementation details.

## Use Case Scenarios

### Scenario 1: Custom Styled Buttons

**When to use**: You want to create buttons that match your design system or brand guidelines, with complete control over styling.

**User experience**: Users see buttons that look exactly as designed, with consistent styling across the application. The buttons work like native HTML buttons but with your custom styling.

**Example situations**:

- A design system that requires specific button styles
- A brand that needs custom button appearances
- An application with a unique visual style

### Scenario 2: Loading State Management

**When to use**: You need buttons that show a loading state and automatically prevent interactions during async operations.

**User experience**: When a button is in loading state, it becomes disabled automatically, preventing users from clicking it multiple times. The button shows visual feedback (via `data-loading` attribute) that an operation is in progress.

**Example situations**:

- Submit buttons during form submission
- Action buttons during API calls
- Buttons that trigger async operations

### Scenario 3: Form Submission Buttons

**When to use**: You need buttons for form submission or reset functionality, with proper form integration.

**User experience**: Users can submit or reset forms using buttons that are properly integrated with form handling. The buttons work correctly with form validation and submission.

**Example situations**:

- Login forms with submit buttons
- Registration forms with submit and reset buttons
- Any form that needs proper button types

### Scenario 4: Disabled Button States

**When to use**: You need buttons that can be disabled based on certain conditions, with proper visual and functional feedback.

**User experience**: When a button is disabled, it doesn't respond to clicks, touches, or any interactions. This clearly indicates that the action is not currently available.

**Example situations**:

- Submit buttons disabled until form is valid
- Action buttons disabled based on user permissions
- Buttons that become unavailable based on application state

### Scenario 5: Custom Element Rendering

**When to use**: You need to render a button-like element using a different HTML element (like `div` or `a`) while maintaining button-like behavior.

**User experience**: Users interact with elements that look and behave like buttons, but are rendered as different HTML elements. This is useful for custom layouts or when you need specific HTML structure.

**Example situations**:

- Custom navigation elements that need button behavior
- Card-based interfaces where divs need to be clickable
- Links that need button-like styling and behavior

### Scenario 6: Custom Component Integration

**When to use**: You need to use a custom component (like a router Link) as a button while maintaining type safety and button behavior.

**User experience**: Users interact with components that have button-like behavior but are actually custom components. TypeScript provides full type safety and autocomplete for the custom component's props.

**Example situations**:

- Router links that need button styling
- Custom navigation components
- Third-party components that need button behavior

### Scenario 7: CSS-Based Loading Indicators

**When to use**: You want to style loading states using CSS selectors based on the `data-loading` attribute.

**User experience**: Buttons show loading indicators (spinners, progress bars, etc.) styled purely with CSS when in loading state. This keeps styling logic separate from component logic.

**Example situations**:

- Design systems with predefined loading styles
- Applications using CSS frameworks
- Projects that prefer CSS over JavaScript for styling

### Scenario 8: Preventing Multiple Submissions

**When to use**: You need to prevent users from clicking a button multiple times during an async operation.

**User experience**: When a user clicks a button that triggers an async operation, the button becomes disabled automatically, preventing accidental duplicate submissions or requests.

**Example situations**:

- Form submission buttons
- Payment processing buttons
- Any button that triggers server requests
