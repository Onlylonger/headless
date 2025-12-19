import { useState, useCallback } from 'react'
import type { UseToggleReturn } from './types'

/**
 * A headless hook for managing boolean toggle state
 *
 * @param initialValue - The initial boolean value (default: false)
 * @returns A tuple containing [state, toggle, setValue]
 *
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 * ```
 */
export function useToggle(initialValue = false): UseToggleReturn {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue)
  }, [])

  return [value, toggle, setToggle]
}
