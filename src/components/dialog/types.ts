import type * as React from 'react'
import type { PolymorphicComponentProps } from '../../utils/polymorphic'
import type { useDialog } from './use-dialog'
import { ButtonProps } from '../button'

export interface DialogOptions {
  initialOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type DialogProps = {
  children: React.ReactNode
} & DialogOptions

export type DialogTriggerOwnProps = {
  children: React.ReactNode
}

export type DialogTriggerProps<C extends React.ElementType = 'button'> = PolymorphicComponentProps<
  C,
  DialogTriggerOwnProps
>

export type DialogTriggerImplProps = Omit<DialogTriggerProps<'button'>, 'component'> & {
  component?: React.ElementType
}

export type DialogContentProps = React.HTMLProps<HTMLDivElement>
export type DialogHeadingProps = React.HTMLProps<HTMLHeadingElement> & {
  children?: React.ReactNode
}
export type DialogDescriptionProps = React.HTMLProps<HTMLParagraphElement> & {
  children?: React.ReactNode
}
export type DialogCloseProps = ButtonProps<'button'>

export type DialogContextValue =
  | (ReturnType<typeof useDialog> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
      setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    })
  | null

export type DialogProviderProps = {
  value: NonNullable<DialogContextValue>
  children: React.ReactNode
}

export type DialogCloseReason = 'escape' | 'outside' | 'cancel'

export type CreateDialogCallbacks = {
  onOk?: () => void
  onClose?: (reason: DialogCloseReason) => void
}

export type CreateDialogStore = {
  isOpen: boolean
  callbacks: CreateDialogCallbacks | null
  open: (callbacks?: CreateDialogCallbacks) => void
  close: (reason?: DialogCloseReason) => void
  ok: () => void
}

export type CreateDialogStoreAPI = {
  readonly isOpen: boolean
  open: (callbacks?: CreateDialogCallbacks) => void
  close: (reason?: DialogCloseReason) => void
  ok: () => void
  _store: ReturnType<typeof import('zustand').create<CreateDialogStore>>
}
