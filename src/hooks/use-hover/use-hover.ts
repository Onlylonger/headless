import { useState, useMemo, useRef, useEffect } from 'react'
import {
  setupGlobalTouchEvents,
  getOwnerDocument,
  nodeContains,
  getGlobalIgnoreEmulatedMouseEvents,
} from './utils'
import type { UseHoverOptions, UseHoverReturn } from './types'

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 *
 * @param options - Configuration options
 * @returns An object containing hover state and props to spread on elements
 *
 * @example
 * ```tsx
 * const { isHovered, hoverProps } = useHover({
 *   onHoverStart: (e) => console.log('Hover started', e.pointerType),
 *   onHoverEnd: (e) => console.log('Hover ended', e.pointerType),
 *   onHoverChange: (isHovered) => console.log('Hover state:', isHovered)
 * });
 *
 * <div {...hoverProps}>
 *   {isHovered ? 'Hovered' : 'Not hovered'}
 * </div>
 * ```
 */
export function useHover(options: UseHoverOptions = {}): UseHoverReturn {
  const { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = options
  const [isHovered, setIsHovered] = useState(false)
  const state = useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: '' as 'mouse' | 'touch' | 'pen' | '',
    target: null as Element | null,
  }).current
  const triggerHoverEndRef = useRef<
    | ((
        event: React.PointerEvent | React.MouseEvent,
        pointerType: 'mouse' | 'touch' | 'pen'
      ) => void)
    | null
  >(null)

  useEffect(setupGlobalTouchEvents, [])

  const { hoverProps, triggerHoverEnd } = useMemo(() => {
    const globalListeners: Array<() => void> = []

    const triggerHoverStart = (
      event: React.PointerEvent | React.MouseEvent,
      pointerType: 'mouse' | 'touch' | 'pen'
    ) => {
      state.pointerType = pointerType
      if (
        isDisabled ||
        pointerType === 'touch' ||
        state.isHovered ||
        !(event.currentTarget as Element).contains(event.target as Element)
      ) {
        return
      }

      state.isHovered = true
      const target = event.currentTarget as Element
      state.target = target

      // When an element that is hovered over is removed, no pointerleave event is fired by the browser.
      // We listen for pointerover events on the document to detect when the mouse moves to a different element.
      const ownerDocument = getOwnerDocument(event.target as Element)
      if (ownerDocument) {
        const handlePointerOver = (e: PointerEvent) => {
          if (state.isHovered && state.target && !nodeContains(state.target, e.target as Element)) {
            triggerHoverEnd(
              {
                currentTarget: state.target,
                target: e.target,
                pointerType: e.pointerType,
              } as unknown as React.PointerEvent,
              e.pointerType as 'mouse' | 'touch' | 'pen'
            )
          }
        }

        ownerDocument.addEventListener('pointerover', handlePointerOver, { capture: true })
        globalListeners.push(() => {
          ownerDocument.removeEventListener('pointerover', handlePointerOver, { capture: true })
        })
      }

      if (onHoverStart) {
        onHoverStart({
          type: 'hoverstart',
          target,
          pointerType,
        })
      }

      if (onHoverChange) {
        onHoverChange(true)
      }

      setIsHovered(true)
    }

    const triggerHoverEnd = (
      _event: React.PointerEvent | React.MouseEvent,
      pointerType: 'mouse' | 'touch' | 'pen'
    ) => {
      const target = state.target
      state.pointerType = ''
      state.target = null

      if (!state.isHovered || !target) {
        return
      }

      state.isHovered = false

      // Remove all global listeners
      globalListeners.forEach((remove) => remove())
      globalListeners.length = 0

      if (onHoverEnd) {
        onHoverEnd({
          type: 'hoverend',
          target,
          pointerType,
        })
      }

      if (onHoverChange) {
        onHoverChange(false)
      }

      setIsHovered(false)
    }

    // 统一使用 PointerEvent API
    // 现代浏览器都支持，无需降级到 MouseEvent
    const hoverProps: Omit<UseHoverReturn['hoverProps'], 'data-hover'> = {
      onPointerEnter: (e: React.PointerEvent) => {
        // 忽略 iOS 触摸后模拟的鼠标事件
        if (getGlobalIgnoreEmulatedMouseEvents() && e.pointerType === 'mouse') {
          return
        }

        triggerHoverStart(e, e.pointerType)
      },

      onPointerLeave: (e: React.PointerEvent) => {
        if (!isDisabled && (e.currentTarget as Element).contains(e.target as Element)) {
          triggerHoverEnd(e, e.pointerType)
        }
      },
    }

    return { hoverProps, triggerHoverEnd }
  }, [onHoverStart, onHoverChange, onHoverEnd, isDisabled, state])

  triggerHoverEndRef.current = triggerHoverEnd

  useEffect(() => {
    // Call triggerHoverEnd as soon as isDisabled changes to true
    // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
    if (isDisabled && triggerHoverEndRef.current) {
      const syntheticEvent = {
        currentTarget: state.target,
        target: state.target,
        pointerType: state.pointerType || 'mouse',
      } as unknown as React.PointerEvent
      triggerHoverEndRef.current(
        syntheticEvent,
        (state.pointerType || 'mouse') as 'mouse' | 'touch' | 'pen'
      )
    }
  }, [isDisabled, state])

  return {
    isHovered,
    hoverProps: {
      ...hoverProps,
      'data-hover': isHovered,
    },
  }
}
