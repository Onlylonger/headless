import { ToastProvider } from './context'
import type { ToastProviderProps } from './types'
import { createToastManager } from './use-toast-manager'
import { useMemo } from 'react'

export function Toast(props: ToastProviderProps) {
  const { children, toastManager: providedManager } = props

  // Create a manager if not provided
  const manager = useMemo(() => providedManager || createToastManager(), [providedManager])

  return <ToastProvider toastManager={manager}>{children}</ToastProvider>
}
