import type { PolymorphicComponentProps } from '../../utils/polymorphic'
import { ButtonProps } from '../button'
import type { useDialog } from './use-dialog'
import type {
  ReactNode,
  ElementType,
  HTMLProps,
  Dispatch,
  SetStateAction,
  ComponentProps,
} from 'react'

export interface DialogOptions {
  initialOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type DialogProps = {
  children: ReactNode
} & DialogOptions

export type DialogTriggerOwnProps = {
  children: ReactNode
}

export type DialogTriggerProps<C extends ElementType = 'button'> = PolymorphicComponentProps<
  C,
  DialogTriggerOwnProps
>

export type DialogTriggerImplProps = Omit<DialogTriggerProps<'button'>, 'component'> & {
  component?: ElementType
}

import type {
  FloatingPortalProps,
  FloatingFocusManagerProps,
  FloatingOverlay,
} from '@floating-ui/react'

export type DialogContentProps = HTMLProps<HTMLDivElement> & {
  /**
   * Props for FloatingPortal component
   * @see https://floating-ui.com/docs/FloatingPortal
   */
  portalProps?: Omit<FloatingPortalProps, 'children'>
  /**
   * Props for FloatingOverlay component
   * @see https://floating-ui.com/docs/FloatingOverlay
   */
  overlayProps?: Omit<ComponentProps<typeof FloatingOverlay>, 'children'>
  /**
   * Props for FloatingFocusManager component
   * Note: `context` prop is automatically provided and cannot be overridden
   * @see https://floating-ui.com/docs/FloatingFocusManager
   */
  focusManagerProps?: Omit<FloatingFocusManagerProps, 'context' | 'children'>
}
export type DialogHeadingProps = HTMLProps<HTMLHeadingElement> & {
  children?: ReactNode
}
export type DialogDescriptionProps = HTMLProps<HTMLParagraphElement> & {
  children?: ReactNode
}
export type DialogCloseProps = ButtonProps<'button'>

export type DialogContextValue =
  | (ReturnType<typeof useDialog> & {
      setLabelId: Dispatch<SetStateAction<string | undefined>>
      setDescriptionId: Dispatch<SetStateAction<string | undefined>>
    })
  | null

export type DialogProviderProps = {
  value: NonNullable<DialogContextValue>
  children: ReactNode
}

export type DialogCloseReason = 'escape' | 'outside' | 'cancel'

export type CreateDialogCallbacks = {
  onOk?: () => void
  onClose?: (reason: DialogCloseReason) => void
}

export type CreateDialogStore = {
  isOpen: boolean
  toggle: (value: boolean) => void
}

export type CreateDialogStoreAPI = {
  readonly isOpen: boolean
  open: (callbacks?: CreateDialogCallbacks) => void
  close: (reason?: DialogCloseReason) => void
  ok: () => void
  _store: ReturnType<typeof import('zustand').create<CreateDialogStore>>
}
