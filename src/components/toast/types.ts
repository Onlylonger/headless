import type { ReactNode, HTMLProps } from 'react'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  /**
   * Toast title
   */
  title?: ReactNode
  /**
   * Toast description
   */
  description?: ReactNode
  /**
   * Toast type
   * @default 'default'
   */
  type?: ToastType
  /**
   * Auto dismiss timeout in milliseconds
   * @default 5000
   */
  timeout?: number
  /**
   * Priority level
   * @default 'low'
   */
  priority?: 'low' | 'high'
  /**
   * Callback when toast is closed
   */
  onClose?: () => void
  /**
   * Callback when toast is removed from list
   */
  onRemove?: () => void
  /**
   * Action button props
   */
  actionProps?: HTMLProps<HTMLButtonElement>
  /**
   * Custom data
   */
  data?: Record<string, unknown>
}

export interface ToastObject extends ToastOptions {
  id: string
  createdAt: number
}

export interface ToastManager {
  /**
   * Array of active toasts
   */
  toasts: ToastObject[]
  /**
   * Add a new toast
   */
  add: (options: ToastOptions) => string
  /**
   * Update an existing toast
   */
  update: (toastId: string, options: Partial<ToastOptions>) => void
  /**
   * Close a toast
   */
  close: (toastId: string) => void
  /**
   * Create a toast from a promise
   */
  promise: <Value>(
    promise: Promise<Value>,
    options: {
      loading?: string | ToastOptions
      success?: string | ((value: Value) => string | ToastOptions)
      error?: string | ((error: unknown) => string | ToastOptions)
    }
  ) => Promise<Value>
  /**
   * Internal: Subscribe to changes
   */
  _subscribe?: (listener: () => void) => () => void
  /**
   * Internal: Get current state
   */
  _getState?: () => { toasts: ToastObject[] }
}

export type ToastProviderProps = {
  children: ReactNode
  /**
   * Custom toast manager instance
   */
  toastManager?: ToastManager
}

export type ToastViewportProps = HTMLProps<HTMLDivElement>

export type ToastRootProps = HTMLProps<HTMLDivElement> & {
  toast: ToastObject
}

export type ToastContentProps = HTMLProps<HTMLDivElement>

export type ToastTitleProps = HTMLProps<HTMLHeadingElement> & {
  children?: ReactNode
}

export type ToastDescriptionProps = HTMLProps<HTMLParagraphElement> & {
  children?: ReactNode
}

export type ToastActionProps = Omit<HTMLProps<HTMLButtonElement>, 'type'> & {
  type?: 'button' | 'submit' | 'reset'
}

export type ToastCloseProps = HTMLProps<HTMLButtonElement>

export type CreateToastStore = {
  toasts: ToastObject[]
  add: (options: ToastOptions) => string
  update: (toastId: string, options: Partial<ToastOptions>) => void
  close: (toastId: string) => void
  promise: ToastManager['promise']
}
