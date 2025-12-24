import { useDialogContext } from './context'
import type { DialogDescriptionProps } from './types'
import { useId } from '@floating-ui/react'
import { useLayoutEffect, forwardRef, type ForwardedRef } from 'react'

function DialogDescriptionImpl(
  props: DialogDescriptionProps,
  ref: ForwardedRef<HTMLParagraphElement>
) {
  const { children, ...rest } = props

  const { setDescriptionId } = useDialogContext()
  const id = useId()

  // Only sets `aria-describedby` on the Dialog root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setDescriptionId(id)
    return () => setDescriptionId(undefined)
  }, [id, setDescriptionId])

  return (
    <p {...rest} ref={ref} id={id}>
      {children}
    </p>
  )
}

export const DialogDescription = forwardRef(DialogDescriptionImpl)
