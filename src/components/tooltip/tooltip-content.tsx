import { useTooltipContext } from './context'
import type { TooltipContentProps } from './types'
import { FloatingPortal, useMergeRefs } from '@floating-ui/react'
import { forwardRef, type ForwardedRef } from 'react'

function TooltipContentImpl(props: TooltipContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, portalProps, style, ...rest } = props

  const context = useTooltipContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])

  if (!context.open) return null

  return (
    <FloatingPortal {...portalProps}>
      <div
        ref={mergedRef}
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(rest)}
      >
        {children}
      </div>
    </FloatingPortal>
  )
}

export const TooltipContent = forwardRef(TooltipContentImpl)
