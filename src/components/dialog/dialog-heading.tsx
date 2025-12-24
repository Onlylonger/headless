import { useDialogContext } from './context'
import type { DialogHeadingProps } from './types'
import { useId } from '@floating-ui/react'
import { useLayoutEffect, forwardRef, type ForwardedRef } from 'react'

function DialogHeadingImpl(props: DialogHeadingProps, ref: ForwardedRef<HTMLHeadingElement>) {
  const { children, ...rest } = props

  const { setLabelId } = useDialogContext()
  const id = useId()

  // Only sets `aria-labelledby` on the Dialog root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setLabelId(id)
    return () => setLabelId(undefined)
  }, [id, setLabelId])

  return (
    <h2 {...rest} ref={ref} id={id}>
      {children}
    </h2>
  )
}

export const DialogHeading = forwardRef(DialogHeadingImpl)
