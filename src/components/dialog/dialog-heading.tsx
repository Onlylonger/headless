import * as React from 'react'
import { useId } from '@floating-ui/react'
import { useDialogContext } from './context'
import type { DialogHeadingProps } from './types'

function DialogHeadingImpl(
  { children, ...props }: DialogHeadingProps,
  ref: React.ForwardedRef<HTMLHeadingElement>
) {
  const { setLabelId } = useDialogContext()
  const id = useId()

  // Only sets `aria-labelledby` on the Dialog root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [id, setLabelId])

  return (
    <h2 {...props} ref={ref} id={id}>
      {children}
    </h2>
  )
}

export const DialogHeading = React.forwardRef(DialogHeadingImpl)
