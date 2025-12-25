import { TooltipProvider } from './context'
import type { TooltipProps } from './types'
import { useTooltip } from './use-tooltip'

export function Tooltip(props: TooltipProps) {
  const { children, ...options } = props

  const tooltip = useTooltip(options)

  return <TooltipProvider value={tooltip}>{children}</TooltipProvider>
}
