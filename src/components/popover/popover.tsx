import { PopoverProvider } from './context'
import type { PopoverProps } from './types'
import { usePopover } from './use-popover'

export function Popover(props: PopoverProps) {
  const { children, modal = false, ...options } = props

  const popover = usePopover({ modal, ...options })

  return <PopoverProvider value={popover}>{children}</PopoverProvider>
}
