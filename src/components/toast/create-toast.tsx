import type { CreateToastStore, ToastOptions } from './types'
import { createToastManager } from './use-toast-manager'
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'

export function createToast(): [
  UseBoundStore<StoreApi<CreateToastStore>>,
  ReturnType<typeof createToastManager>,
] {
  const manager = createToastManager()

  const useStore = create<CreateToastStore>((set) => ({
    toasts: [],
    add: (options: ToastOptions) => {
      const toastId = manager.add(options)
      set({ toasts: manager.toasts })
      return toastId
    },
    update: (toastId: string, options: Partial<ToastOptions>) => {
      manager.update(toastId, options)
      set({ toasts: manager.toasts })
    },
    close: (toastId: string) => {
      manager.close(toastId)
      set({ toasts: manager.toasts })
    },
    promise: manager.promise,
  }))

  // Subscribe to manager changes to sync with store
  if (manager._subscribe) {
    manager._subscribe(() => {
      useStore.setState({ toasts: manager.toasts })
    })
  }

  return [useStore, manager]
}
