import type { PolymorphicComponentProps } from '../../utils/polymorphic'
import type { useTooltip } from './use-tooltip'
import type { Placement } from '@floating-ui/react'
import type { FloatingPortalProps } from '@floating-ui/react'
import type { ReactNode, HTMLProps } from 'react'
import type { ElementType } from 'react'

export interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  trigger?: 'hover' | 'click'
  onOpenChange?: (open: boolean) => void
}

export type TooltipProps = {
  children: ReactNode
} & TooltipOptions

export type TooltipTriggerOwnProps = {
  children: ReactNode
}

export type TooltipTriggerProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  TooltipTriggerOwnProps
>

export type TooltipTriggerImplProps = Omit<TooltipTriggerProps<'button'>, 'component'> & {
  component?: ElementType
}

export type TooltipContentProps = HTMLProps<HTMLDivElement> & {
  /**
   * Props for FloatingPortal component
   * @see https://floating-ui.com/docs/FloatingPortal
   */
  portalProps?: Omit<FloatingPortalProps, 'children'>
}

export type TooltipContextValue = ReturnType<typeof useTooltip> | null

export type TooltipProviderProps = {
  value: NonNullable<TooltipContextValue>
  children: ReactNode
}

export type CreateTooltipStore = {
  isOpen: boolean
  toggle: (value: boolean) => void
}

export type TooltipContainerProps = TooltipOptions & {
  /**
   * Tooltip content (similar to Ant Design's `title` prop)
   */
  title?: ReactNode
  /**
   * Trigger element (children)
   */
  children: ReactNode
  /**
   * Trigger action type
   * @default 'hover'
   */
  trigger?: 'hover' | 'click' | 'focus'
  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean
}
