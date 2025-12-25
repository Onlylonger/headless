import type { ToastManager } from './types'
import { createContext, useContext } from 'react'

const ToastContext = createContext<ToastManager | null>(null)

export function ToastProvider(props: { children: React.ReactNode; toastManager: ToastManager }) {
  const { children, toastManager } = props

  return <ToastContext.Provider value={toastManager}>{children}</ToastContext.Provider>
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context == null) {
    throw new Error('Toast components must be wrapped in <Toast.Provider />')
  }
  return context
}
