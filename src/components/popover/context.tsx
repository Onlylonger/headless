import type { PopoverContextValue, PopoverProviderProps } from './types'
import { createContext, useContext } from 'react'

const PopoverContext = createContext<PopoverContextValue>(null)

export function PopoverProvider(props: PopoverProviderProps) {
  const { value, children } = props

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
}

export function usePopoverContext() {
  const context = useContext(PopoverContext)
  if (context == null) {
    throw new Error('Popover components must be wrapped in <Popover />')
  }
  return context
}
