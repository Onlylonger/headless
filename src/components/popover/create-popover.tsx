import { Popover as OriginPopover } from './popover'
import { PopoverContent } from './popover-content'
import type { CreatePopoverStore, PopoverContentProps } from './types'
import type { ReactNode } from 'react'
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'

type PopoverProps = {
  className?: string
  children: ReactNode
} & PopoverContentProps

export function createPopover(): [
  UseBoundStore<StoreApi<CreatePopoverStore>>,
  (props: PopoverProps) => JSX.Element,
] {
  const useStore = create<CreatePopoverStore>((set) => ({
    isOpen: false,
    toggle(value) {
      set({
        isOpen: value,
      })
    },
  }))

  function Popover(props: PopoverProps) {
    const { children, ...rest } = props

    const isOpen = useStore((state) => state.isOpen)
    const handleToggle = useStore((state) => state.toggle)

    return (
      <OriginPopover open={isOpen} onOpenChange={handleToggle}>
        <PopoverContent {...rest}>{children}</PopoverContent>
      </OriginPopover>
    )
  }

  return [useStore, Popover]
}
