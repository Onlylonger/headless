import * as React from 'react'
import type { ElementType } from 'react'
import { forwardRefPolymorphic } from '../../utils/polymorphic'
import type { ButtonComponentProps, ButtonOwnProps } from './types'

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
 * <Button component="div" onClick={() => console.log('clicked')}>
 *   Custom element
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button component={Link} to="/page" onClick={() => console.log('clicked')}>
 *   Custom component
 * </Button>
 * ```
 */
function ButtonImpl(props: ButtonComponentProps<'button'>, ref: React.ForwardedRef<any>) {
  const { component, loading = false, type = 'button', children, ...rest } = props
  const Component: ElementType = component ?? 'button'

  const isDisabled = rest.disabled || loading

  const buttonProps = {
    ...rest,
    ref,
    disabled: isDisabled,
    'data-loading': loading,
    ...(typeof Component === 'string' &&
      Component === 'button' && {
        type,
      }),
  }

  return <Component {...buttonProps}>{children}</Component>
}

export const Button = forwardRefPolymorphic<'button', ButtonOwnProps>(ButtonImpl)
