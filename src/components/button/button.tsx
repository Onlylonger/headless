import { forwardRef, type ElementType } from 'react'
import type { ButtonComponentProps } from './types'

/**
 * A flexible button component that can render as any element or component.
 * Supports loading and disabled states that automatically prevent all interactions.
 *
 * When `loading` is true, the button will be disabled (using native `disabled` attribute)
 * and have `data-loading="true"` attribute for CSS styling.
 *
 * @example
 * ```tsx
 * <Button onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button loading onClick={() => console.log('This will not fire')}>
 *   Loading...
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button as="div" onClick={() => console.log('clicked')}>
 *   Custom element
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button as={Link} to="/page" onClick={() => console.log('clicked')}>
 *   Custom component
 * </Button>
 * ```
 */
function ButtonImpl(
  props: ButtonComponentProps<ElementType>,
  ref: React.ForwardedRef<HTMLElement>
) {
  const { as, loading = false, type = 'button', children, ...rest } = props
  const Component = (as || 'button') as ElementType

  const isDisabled = rest.disabled || loading

  const buttonProps = {
    ...rest,
    ref,
    disabled: isDisabled,
    'data-loading': loading,
    ...(Component === 'button' && {
      type,
    }),
  }

  return <Component {...buttonProps}>{children}</Component>
}

export const Button = forwardRef(ButtonImpl) as <T extends ElementType = 'button'>(
  props: ButtonComponentProps<T> & { ref?: React.ComponentPropsWithRef<T>['ref'] }
) => JSX.Element
