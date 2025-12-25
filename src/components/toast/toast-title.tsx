import type { ToastTitleProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastTitleImpl(props: ToastTitleProps, ref: ForwardedRef<HTMLHeadingElement>) {
  const { children, ...rest } = props

  return (
    <h3 ref={ref} {...rest}>
      {children}
    </h3>
  )
}

export const ToastTitle = forwardRef(ToastTitleImpl)
