import { useToastContext } from './context'

/**
 * Hook to access the toast manager
 * Must be used inside a Toast.Provider
 */
export function useToast() {
  return useToastContext()
}
