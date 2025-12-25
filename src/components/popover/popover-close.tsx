import { Button } from '../button'
import { usePopoverContext } from './context'
import type { PopoverCloseProps } from './types'
import { useCallback, forwardRef, type ForwardedRef, type MouseEvent } from 'react'

function PopoverCloseImpl(props: PopoverCloseProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { onClick, ...rest } = props

  const { setOpen } = usePopoverContext()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setOpen(false)
      onClick?.(e)
    },
    [setOpen, onClick]
  )

  return <Button {...rest} ref={ref} onClick={handleClick} />
}

export const PopoverClose = forwardRef(PopoverCloseImpl)
