import { useRef, useEffect, useCallback, useState } from 'react'
import { createPopper, offset as offsetModifier, flip as flipModifier } from './mini-floating-ui'
import type {
  Placement,
  PositioningStrategy,
  Instance,
  OptionsGeneric,
  Modifier,
} from './mini-floating-ui/interface'

export interface UseFloatingOptions {
  placement?: Placement
  strategy?: PositioningStrategy
  offset?: number
  middleware?: Modifier<any, any>[]
  whileElementsMounted?: (
    reference: HTMLElement,
    floating: HTMLElement,
    update: () => void
  ) => () => void
}

export interface UseFloatingReturn {
  x: number
  y: number
  placement: Placement
  strategy: PositioningStrategy
  update: () => void
  reference: (node: HTMLElement | null) => void
  floating: (node: HTMLElement | null) => void
}

export function useFloating(options: UseFloatingOptions = {}): UseFloatingReturn {
  const {
    placement: initialPlacement = 'bottom',
    strategy = 'fixed',
    offset: offsetValue = 0,
    middleware = [],
    whileElementsMounted,
  } = options

  // Default middleware: offset and flip
  const defaultMiddleware: Modifier<any, any>[] = [
    {
      ...offsetModifier,
      options: {
        offset: [0, offsetValue],
      },
    },
    flipModifier,
  ]

  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [placement, setPlacement] = useState<Placement>(initialPlacement)
  const referenceRef = useRef<HTMLElement | null>(null)
  const floatingRef = useRef<HTMLElement | null>(null)
  const instanceRef = useRef<Instance | null>(null)

  // Create popper instance when both refs are available
  useEffect(() => {
    if (!referenceRef.current || !floatingRef.current) return

    const instance = createPopper(referenceRef.current, floatingRef.current, {
      placement: initialPlacement,
      strategy,
      modifiers: [...defaultMiddleware, ...middleware],
    } as Partial<OptionsGeneric<any>>)

    instanceRef.current = instance

    // Apply styles to floating element
    const applyStyles = () => {
      instance.forceUpdate()
      const state = instance.state
      if (state.styles?.popper && floatingRef.current) {
        Object.assign(floatingRef.current.style, state.styles.popper)
      }
      if (state.modifiersData?.popperOffsets) {
        const offsets = state.modifiersData.popperOffsets as { x: number; y: number }
        setCoords({ x: offsets.x || 0, y: offsets.y || 0 })
      }
      setPlacement(state.placement)
    }

    // Initial update
    applyStyles()

    // Setup update listeners
    let cleanup: (() => void) | undefined

    if (whileElementsMounted && referenceRef.current && floatingRef.current) {
      cleanup = whileElementsMounted(referenceRef.current, floatingRef.current, () => {
        instance.forceUpdate()
        const state = instance.state
        if (state.styles?.popper && floatingRef.current) {
          Object.assign(floatingRef.current.style, state.styles.popper)
        }
        if (state.modifiersData?.popperOffsets) {
          const offsets = state.modifiersData.popperOffsets as { x: number; y: number }
          setCoords({ x: offsets.x || 0, y: offsets.y || 0 })
        }
        setPlacement(state.placement)
      })
    } else {
      // Default: listen to scroll and resize
      const handleScroll = () => {
        instance.forceUpdate()
        const state = instance.state
        if (state.styles?.popper && floatingRef.current) {
          Object.assign(floatingRef.current.style, state.styles.popper)
        }
        if (state.modifiersData?.popperOffsets) {
          const offsets = state.modifiersData.popperOffsets as { x: number; y: number }
          setCoords({ x: offsets.x || 0, y: offsets.y || 0 })
        }
        setPlacement(state.placement)
      }
      const handleResize = handleScroll

      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)

      cleanup = () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
        instance.destroy()
      }
    }

    return cleanup
  }, [initialPlacement, strategy, middleware, whileElementsMounted])

  const update = useCallback(() => {
    if (instanceRef.current && floatingRef.current) {
      instanceRef.current.forceUpdate()
      const state = instanceRef.current.state
      if (state.styles?.popper) {
        Object.assign(floatingRef.current.style, state.styles.popper)
      }
      if (state.modifiersData?.popperOffsets) {
        const offsets = state.modifiersData.popperOffsets as { x: number; y: number }
        setCoords({ x: offsets.x || 0, y: offsets.y || 0 })
      }
      setPlacement(state.placement)
    }
  }, [])

  const setReference = useCallback((node: HTMLElement | null) => {
    if (referenceRef.current === node) return
    referenceRef.current = node
  }, [])

  const setFloating = useCallback((node: HTMLElement | null) => {
    if (floatingRef.current === node) return
    floatingRef.current = node
  }, [])

  return {
    x: coords.x,
    y: coords.y,
    placement,
    strategy,
    update,
    reference: setReference,
    floating: setFloating,
  }
}
