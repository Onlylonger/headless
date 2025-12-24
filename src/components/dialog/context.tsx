import type { DialogContextValue, DialogProviderProps } from './types'
import { createContext, useContext } from 'react'

const DialogContext = createContext<DialogContextValue>(null)

export function DialogProvider(props: DialogProviderProps) {
  const { value, children } = props

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export function useDialogContext() {
  const context = useContext(DialogContext)
  if (context == null) {
    throw new Error('Dialog components must be wrapped in <Dialog />')
  }
  return context
}
