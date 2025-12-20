import { useState, useRef, useEffect, useMemo } from 'react'

export interface UseFocusRingOptions {
  autoFocus?: boolean
}

export interface UseFocusRingReturn {
  isFocused: boolean
  isFocusVisible: boolean
  focusProps: {
    onFocus: (e: React.FocusEvent) => void
    onBlur: (e: React.FocusEvent) => void
  }
}

/**
 * A headless hook for managing focus ring visibility
 * Inspired by @react-aria/focus useFocusRing
 *
 * Determines whether a focus ring should be shown to indicate keyboard focus.
 * Focus rings are only visible when the user is interacting with a keyboard,
 * not when interacting with a mouse or touch.
 *
 * @param options - Configuration options
 * @returns An object containing focus state and props to spread on elements
 *
 * @example
 * ```tsx
 * const { isFocused, isFocusVisible, focusProps } = useFocusRing();
 *
 * <button
 *   {...focusProps}
 *   style={{
 *     outline: isFocusVisible ? '2px solid dodgerblue' : 'none',
 *   }}
 * >
 *   Test
 * </button>
 * ```
 */
export function useFocusRing(options: UseFocusRingOptions = {}): UseFocusRingReturn {
  const { autoFocus = false } = options
  const [isFocused, setIsFocused] = useState(autoFocus)
  const [isFocusVisible, setIsFocusVisible] = useState(autoFocus)
  const hadKeyboardEvent = useRef(true)
  const hadFocusVisibleWithin = useRef(false)

  useEffect(() => {
    if (autoFocus) {
      setIsFocused(true)
      setIsFocusVisible(true)
    }
  }, [autoFocus])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return
      }
      hadKeyboardEvent.current = true
    }

    const handleMouseDown = () => {
      hadKeyboardEvent.current = false
    }

    const handlePointerDown = () => {
      hadKeyboardEvent.current = false
    }

    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('mousedown', handleMouseDown, true)
    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('mousedown', handleMouseDown, true)
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [])

  const focusProps = useMemo(
    () => ({
      onFocus: () => {
        setIsFocused(true)
        if (hadKeyboardEvent.current || hadFocusVisibleWithin.current) {
          setIsFocusVisible(true)
          hadFocusVisibleWithin.current = true
        }
      },
      onBlur: () => {
        setIsFocused(false)
        setIsFocusVisible(false)
        hadFocusVisibleWithin.current = false
        hadKeyboardEvent.current = false
      },
    }),
    []
  )

  return { isFocused, isFocusVisible, focusProps }
}
