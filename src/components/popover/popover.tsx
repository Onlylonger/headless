import { cloneElement, useRef, useEffect, useCallback } from 'react'
import { useFloating } from './use-floating'
import type { PopoverProps } from './types'

function Popover(props: PopoverProps) {
  const {
    open = false,
    onOpenChange,
    placement = 'bottom',
    offset = 8,
    strategy = 'fixed',
    children,
    content,
    showArrow = false,
  } = props

  const { x, y, reference, floating } = useFloating({
    placement,
    offset,
    strategy,
  })

  const floatingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && floatingRef.current) {
      floating(floatingRef.current)
    }
  }, [open, floating])

  // Use a ref callback for floating element
  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingRef.current = node
      if (node && open) {
        floating(node)
      }
    },
    [open, floating]
  )

  // Merge refs callback
  const setReferenceRef = useCallback(
    (node: HTMLElement | null) => {
      reference(node)
      // Preserve original ref if exists
      const originalRef = (children as any).ref
      if (typeof originalRef === 'function') {
        originalRef(node)
      } else if (originalRef) {
        originalRef.current = node
      }
    },
    [reference, children]
  )

  // Clone children to attach ref
  const trigger = cloneElement(children, {
    ref: setReferenceRef,
  })

  if (!open) {
    return trigger
  }

  return (
    <>
      {trigger}
      <div
        ref={setFloatingRef}
        style={{
          zIndex: 1000,
        }}
        role="tooltip"
      >
        {content}
        {showArrow && (
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              ...(placement.startsWith('top')
                ? {
                    bottom: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '8px 8px 0 8px',
                    borderColor: 'currentColor transparent transparent transparent',
                  }
                : placement.startsWith('bottom')
                  ? {
                      top: '-8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      borderWidth: '0 8px 8px 8px',
                      borderColor: 'transparent transparent currentColor transparent',
                    }
                  : placement.startsWith('left')
                    ? {
                        right: '-8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderWidth: '8px 0 8px 8px',
                        borderColor: 'transparent transparent transparent currentColor',
                      }
                    : {
                        left: '-8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderWidth: '8px 8px 8px 0',
                        borderColor: 'transparent currentColor transparent transparent',
                      }),
            }}
          />
        )}
      </div>
    </>
  )
}

export { Popover }
