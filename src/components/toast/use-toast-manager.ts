import type { ToastManager, ToastOptions, ToastObject } from './types'
import { useMemo } from 'react'

let toastIdCounter = 0

function generateToastId(): string {
  return `toast-${Date.now()}-${++toastIdCounter}`
}

export function createToastManager(): ToastManager {
  let toasts: ToastObject[] = []
  let listeners: Set<() => void> = new Set()

  const notify = () => {
    listeners.forEach((listener) => listener())
  }

  const add = (options: ToastOptions): string => {
    const id = generateToastId()
    const toast: ToastObject = {
      id,
      createdAt: Date.now(),
      timeout: 5000,
      type: 'default',
      priority: 'low',
      ...options,
    }

    toasts = [...toasts, toast]
    notify()

    // Auto dismiss
    if (toast.timeout && toast.timeout > 0) {
      setTimeout(() => {
        close(id)
      }, toast.timeout)
    }

    return id
  }

  const update = (toastId: string, options: Partial<ToastOptions>): void => {
    toasts = toasts.map((toast) => (toast.id === toastId ? { ...toast, ...options } : toast))
    notify()
  }

  const close = (toastId: string): void => {
    const toast = toasts.find((t) => t.id === toastId)
    if (toast) {
      toast.onClose?.()
    }
    toasts = toasts.filter((t) => t.id !== toastId)
    notify()

    // Call onRemove after a short delay for animations
    if (toast) {
      setTimeout(() => {
        toast.onRemove?.()
      }, 300)
    }
  }

  const promise = <Value>(
    promise: Promise<Value>,
    options: {
      loading?: string | ToastOptions
      success?: string | ((value: Value) => string | ToastOptions)
      error?: string | ((error: unknown) => string | ToastOptions)
    }
  ): Promise<Value> => {
    const loadingOptions: ToastOptions =
      typeof options.loading === 'string'
        ? { description: options.loading }
        : (options.loading ?? { description: 'Loading...' })

    const toastId = add(loadingOptions)

    return promise
      .then((value) => {
        let successOptions: ToastOptions
        if (typeof options.success === 'string') {
          successOptions = { description: options.success }
        } else if (typeof options.success === 'function') {
          const result = options.success(value)
          successOptions = typeof result === 'string' ? { description: result } : result
        } else {
          successOptions = { description: 'Success' }
        }

        update(toastId, { ...successOptions, type: 'success' })
        setTimeout(() => close(toastId), 3000)
        return value
      })
      .catch((error) => {
        let errorOptions: ToastOptions
        if (typeof options.error === 'string') {
          errorOptions = { description: options.error }
        } else if (typeof options.error === 'function') {
          const result = options.error(error)
          errorOptions = typeof result === 'string' ? { description: result } : result
        } else {
          errorOptions = { description: 'An error occurred' }
        }

        update(toastId, { ...errorOptions, type: 'error' })
        setTimeout(() => close(toastId), 5000)
        throw error
      })
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  const getState = () => ({ toasts })

  return {
    get toasts() {
      return toasts
    },
    add,
    update,
    close,
    promise,
    _subscribe: subscribe,
    _getState: getState,
  }
}

export function useToastManager(manager: ToastManager): ToastManager {
  // In a real implementation, this would subscribe to changes
  // For now, we just return the manager
  return useMemo(() => manager, [manager])
}
