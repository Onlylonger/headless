import type { TooltipContextValue, TooltipProviderProps } from './types'
import { createContext, useContext } from 'react'

const TooltipContext = createContext<TooltipContextValue>(null)

export function TooltipProvider(props: TooltipProviderProps) {
  const { value, children } = props

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
}

export function useTooltipContext() {
  const context = useContext(TooltipContext)
  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }
  return context
}
