import { DialogProvider } from './context'
import type { DialogProps } from './types'
import { useDialog } from './use-dialog'

export function Dialog(props: DialogProps) {
  const { children, ...options } = props

  const dialog = useDialog(options)

  return <DialogProvider value={dialog}>{children}</DialogProvider>
}
