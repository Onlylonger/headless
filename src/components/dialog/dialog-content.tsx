import { useDialogContext } from './context'
import type { DialogContentProps } from './types'
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react'
import { forwardRef, useMemo, type ForwardedRef } from 'react'

function DialogContentImpl(props: DialogContentProps, ref: ForwardedRef<HTMLDivElement>) {
  const { children, portalProps, overlayProps = {}, focusManagerProps, ...rest } = props

  const { context: floatingContext, ...context } = useDialogContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])
  const mergedOverlayProps = useMemo(() => ({ lockScroll: true, ...overlayProps }), [overlayProps])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal {...portalProps}>
      <FloatingOverlay {...mergedOverlayProps}>
        <FloatingFocusManager context={floatingContext} {...focusManagerProps}>
          <div
            ref={mergedRef}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(rest)}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}

export const DialogContent = forwardRef(DialogContentImpl)
