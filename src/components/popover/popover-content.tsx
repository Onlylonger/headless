import { usePopoverContext } from './context'
import type { PopoverContentProps } from './types'
import { FloatingPortal, FloatingFocusManager, useMergeRefs } from '@floating-ui/react'
import { forwardRef, type ForwardedRef } from 'react'

function PopoverContentImpl(props: PopoverContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, portalProps, focusManagerProps, style, ...rest } = props

  const { context: floatingContext, ...context } = usePopoverContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal {...portalProps}>
      <FloatingFocusManager context={floatingContext} modal={context.modal} {...focusManagerProps}>
        <div
          ref={mergedRef}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(rest)}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  )
}

export const PopoverContent = forwardRef(PopoverContentImpl)
