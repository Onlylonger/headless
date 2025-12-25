import type { ToastDescriptionProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastDescriptionImpl(
  props: ToastDescriptionProps,
  ref: ForwardedRef<HTMLParagraphElement>
) {
  const { children, ...rest } = props

  return (
    <p ref={ref} {...rest}>
      {children}
    </p>
  )
}

export const ToastDescription = forwardRef(ToastDescriptionImpl)
