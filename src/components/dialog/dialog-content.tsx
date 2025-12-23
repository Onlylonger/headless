import * as React from 'react'
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react'
import { useDialogContext } from './context'
import type { DialogContentProps } from './types'

function DialogContentImpl(props: DialogContentProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const { context: floatingContext, ...context } = useDialogContext()
  const mergedRef = useMergeRefs([context.refs.setFloating, ref])

  if (!floatingContext.open) return null

  return (
    <FloatingPortal>
      <FloatingOverlay className="Dialog-overlay" lockScroll>
        <FloatingFocusManager context={floatingContext}>
          <div
            ref={mergedRef}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(props)}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  )
}

export const DialogContent = React.forwardRef(DialogContentImpl)
