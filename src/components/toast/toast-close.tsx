import { useToastContext } from './context'
import type { ToastCloseProps } from './types'
import { useCallback, forwardRef, type ForwardedRef, type MouseEvent } from 'react'

function ToastCloseImpl(props: ToastCloseProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { onClick, ...rest } = props
  const manager = useToastContext()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Get toastId from data attribute or parent
      const toastId = (e.currentTarget.closest('[data-toast-id]') as HTMLElement)?.dataset.toastId
      if (toastId) {
        manager.close(toastId)
      }
      onClick?.(e)
    },
    [manager, onClick]
  )

  return (
    <button ref={ref} type="button" aria-label="Close" onClick={handleClick} {...(rest as any)} />
  )
}

export const ToastClose = forwardRef(ToastCloseImpl)
