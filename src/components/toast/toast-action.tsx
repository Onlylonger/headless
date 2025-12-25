import type { ToastActionProps } from './types'
import { forwardRef, type ForwardedRef } from 'react'

function ToastActionImpl(props: ToastActionProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { children, type = 'button', ...rest } = props

  return (
    <button ref={ref} type={type} {...rest}>
      {children}
    </button>
  )
}

export const ToastAction = forwardRef(ToastActionImpl)
