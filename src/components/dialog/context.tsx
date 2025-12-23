import * as React from 'react'
import type { DialogContextValue, DialogProviderProps } from './types'

const DialogContext = React.createContext<DialogContextValue>(null)

export function DialogProvider({ value, children }: DialogProviderProps) {
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export function useDialogContext() {
  const context = React.useContext(DialogContext)
  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />')
  }
  return context
}
