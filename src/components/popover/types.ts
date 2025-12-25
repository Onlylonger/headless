import type { PolymorphicComponentProps } from '../../utils/polymorphic'
import { ButtonProps } from '../button'
import type { usePopover } from './use-popover'
import type { Placement } from '@floating-ui/react'
import type { FloatingPortalProps, FloatingFocusManagerProps } from '@floating-ui/react'
import type { ReactNode, HTMLProps, Dispatch, SetStateAction } from 'react'
import type { ElementType } from 'react'

export interface PopoverOptions {
  initialOpen?: boolean
  placement?: Placement
  modal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: 'hover' | 'click'
}

export type PopoverProps = {
  children: ReactNode
} & PopoverOptions

export type PopoverTriggerOwnProps = {
  children: ReactNode
}

export type PopoverTriggerProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  PopoverTriggerOwnProps
>

export type PopoverTriggerImplProps = Omit<PopoverTriggerProps<'button'>, 'component'> & {
  component?: ElementType
}

export type PopoverContentProps = HTMLProps<HTMLDivElement> & {
  /**
   * Props for FloatingPortal component
   * @see https://floating-ui.com/docs/FloatingPortal
   */
  portalProps?: Omit<FloatingPortalProps, 'children'>
  /**
   * Props for FloatingFocusManager component
   * Note: `context` and `modal` props are automatically provided and cannot be overridden
   * @see https://floating-ui.com/docs/FloatingFocusManager
   */
  focusManagerProps?: Omit<FloatingFocusManagerProps, 'context' | 'modal' | 'children'>
}

export type PopoverHeadingProps = HTMLProps<HTMLHeadingElement> & {
  children?: ReactNode
}

export type PopoverDescriptionProps = HTMLProps<HTMLParagraphElement> & {
  children?: ReactNode
}

export type PopoverCloseProps = ButtonProps<'button'>

export type PopoverContextValue =
  | (ReturnType<typeof usePopover> & {
      setLabelId: Dispatch<SetStateAction<string | undefined>>
      setDescriptionId: Dispatch<SetStateAction<string | undefined>>
    })
  | null

export type PopoverProviderProps = {
  value: NonNullable<PopoverContextValue>
  children: ReactNode
}

export type CreatePopoverStore = {
  isOpen: boolean
  toggle: (value: boolean) => void
}

export type PopoverContainerProps = PopoverOptions & {
  /**
   * Popover content (similar to Ant Design's `content` prop)
   */
  content?: ReactNode
  /**
   * Trigger element (children)
   */
  children: ReactNode
  /**
   * Trigger action type
   * @default 'click'
   */
  trigger?: 'hover' | 'click' | 'focus'
  /**
   * Whether the popover is disabled
   * @default false
   */
  disabled?: boolean
}
