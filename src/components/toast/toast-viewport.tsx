import type { ToastViewportProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastViewportImpl(props: ToastViewportProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, ...rest } = props

  return (
    <div ref={ref} role="region" aria-label="Notifications" tabIndex={-1} {...rest}>
      {children}
    </div>
  )
}

export const ToastViewport = forwardRef(ToastViewportImpl)
