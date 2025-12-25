import { usePopoverContext } from './context'
import type { PopoverDescriptionProps } from './types'
import { useId } from '@floating-ui/react'
import { useLayoutEffect, forwardRef, type ForwardedRef } from 'react'

function PopoverDescriptionImpl(
  props: PopoverDescriptionProps,
  ref: ForwardedRef<HTMLParagraphElement>
) {
  const { children, ...rest } = props

  const { setDescriptionId } = usePopoverContext()
  const id = useId()

  // Only sets `aria-describedby` on the Popover root element
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

export const PopoverDescription = forwardRef(PopoverDescriptionImpl)
