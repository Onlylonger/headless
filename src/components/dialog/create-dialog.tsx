import { Dialog as OriginDailog } from './dialog'
import { DialogContent } from './dialog-content'
import type { CreateDialogStore, DialogContentProps } from './types'
import type { ReactNode } from 'react'
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'

type DialogProps = {
  className?: string
  children: ReactNode
} & DialogContentProps

export function createDialog(): [
  UseBoundStore<StoreApi<CreateDialogStore>>,
  (props: DialogProps) => JSX.Element,
] {
  const useStore = create<CreateDialogStore>((set) => ({
    isOpen: false,
    toggle(value) {
      set({
        isOpen: value,
      })
    },
  }))

  function Dialog(props: DialogProps) {
    const { children, ...rest } = props

    const isOpen = useStore((state) => state.isOpen)
    const handleToggle = useStore((state) => state.toggle)

    return (
      <OriginDailog open={isOpen} onOpenChange={handleToggle}>
        <DialogContent {...rest}>{children}</DialogContent>
      </OriginDailog>
    )
  }

  return [useStore, Dialog]
}
