import { Button } from '../button'
import { useDialogContext } from './context'
import type { DialogCloseProps } from './types'
import { useCallback, forwardRef, type ForwardedRef, type MouseEvent } from 'react'

function DialogCloseImpl(props: DialogCloseProps, ref: ForwardedRef<HTMLButtonElement>) {
  const { onClick, ...rest } = props

  const { setOpen } = useDialogContext()

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      console.log('DialogCloseImpl handleClick')
      setOpen(false)
      onClick?.(e)
    },
    [setOpen, onClick]
  )

  return <Button {...rest} ref={ref} onClick={handleClick} />
}

export const DialogClose = forwardRef(DialogCloseImpl)
