import * as React from 'react'
import { useId } from '@floating-ui/react'
import { useDialogContext } from './context'
import type { DialogDescriptionProps } from './types'

function DialogDescriptionImpl(
  { children, ...props }: DialogDescriptionProps,
  ref: React.ForwardedRef<HTMLParagraphElement>
) {
  const { setDescriptionId } = useDialogContext()
  const id = useId()

  // Only sets `aria-describedby` on the Dialog root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [id, setDescriptionId])

  return (
    <p {...props} ref={ref} id={id}>
      {children}
    </p>
  )
}

export const DialogDescription = React.forwardRef(DialogDescriptionImpl)
