import { Tooltip as OriginTooltip } from './tooltip'
import { TooltipContent } from './tooltip-content'
import type { CreateTooltipStore, TooltipContentProps } from './types'
import type { ReactNode } from 'react'
import { create } from 'zustand'
import type { UseBoundStore, StoreApi } from 'zustand'

type TooltipProps = {
  className?: string
  children: ReactNode
} & TooltipContentProps

export function createTooltip(): [
  UseBoundStore<StoreApi<CreateTooltipStore>>,
  (props: TooltipProps) => JSX.Element,
] {
  const useStore = create<CreateTooltipStore>((set) => ({
    isOpen: false,
    toggle(value) {
      set({
        isOpen: value,
      })
    },
  }))

  function Tooltip(props: TooltipProps) {
    const { children, ...rest } = props

    const isOpen = useStore((state) => state.isOpen)
    const handleToggle = useStore((state) => state.toggle)

    return (
      <OriginTooltip open={isOpen} onOpenChange={handleToggle}>
        <TooltipContent {...rest}>{children}</TooltipContent>
      </OriginTooltip>
    )
  }

  return [useStore, Tooltip]
}
