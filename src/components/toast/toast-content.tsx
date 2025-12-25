import type { ToastContentProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastContentImpl(props: ToastContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, ...rest } = props

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
}

export const ToastContent = forwardRef(ToastContentImpl)
