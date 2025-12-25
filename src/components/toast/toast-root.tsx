import type { ToastRootProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastRootImpl(props: ToastRootProps, ref: ForwardedRef<HTMLDivElement>) {
  const { toast, ...rest } = props

  return (
    <div
      ref={ref}
      role="alert"
      aria-live={toast.priority === 'high' ? 'assertive' : 'polite'}
      aria-atomic="true"
      data-toast-type={toast.type}
      data-toast-id={toast.id}
      {...rest}
    />
  )
}

export const ToastRoot = forwardRef(ToastRootImpl)
