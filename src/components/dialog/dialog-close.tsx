import * as React from 'react'
import { useDialogContext } from './context'
import type { DialogCloseProps } from './types'
import { Button } from '../button'

function DialogCloseImpl(props: DialogCloseProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  const context = useDialogContext()
  const { setOpen, closeWithReason } = context as any

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (closeWithReason) {
        closeWithReason('cancel')
      } else {
        setOpen(false)
      }
      props.onClick?.(e)
    },
    [setOpen, closeWithReason, props]
  )

  return <Button {...props} ref={ref} onClick={handleClick} />
}

export const DialogClose = React.forwardRef(DialogCloseImpl)
