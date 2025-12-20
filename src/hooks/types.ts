export type UseToggleReturn = [boolean, () => void, (value: boolean) => void]

export type UseCounterReturn = [
  number,
  {
    increment: () => void
    decrement: () => void
    reset: () => void
    setValue: (value: number) => void
  },
]

export type { UseHoverReturn, UseHoverOptions, HoverEvent } from './use-hover'
export type { UseFocusRingReturn, UseFocusRingOptions } from './use-focus-ring'
