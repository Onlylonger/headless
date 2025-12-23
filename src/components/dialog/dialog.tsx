import { useDialog } from './use-dialog'
import type { DialogProps } from './types'
import { DialogProvider } from './context'

export function Dialog(props: DialogProps) {
  const { children, ...options } = props
  const dialog = useDialog(options)
  return <DialogProvider value={dialog}>{children}</DialogProvider>
}
