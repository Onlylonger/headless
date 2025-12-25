import { usePopoverContext } from './context'
import type { PopoverHeadingProps } from './types'
import { useId } from '@floating-ui/react'
import { useLayoutEffect, forwardRef, type ForwardedRef } from 'react'

function PopoverHeadingImpl(props: PopoverHeadingProps, ref: ForwardedRef<HTMLHeadingElement>) {
  const { children, ...rest } = props

  const { setLabelId } = usePopoverContext()
  const id = useId()

  // Only sets `aria-labelledby` on the Popover root element
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

export const PopoverHeading = forwardRef(PopoverHeadingImpl)
