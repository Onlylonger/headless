import { create } from 'zustand'
import * as React from 'react'
import { useClick, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react'
import { DialogProvider } from './context'
import type { CreateDialogStore, DialogCloseReason, DialogProps } from './types'
import { DialogContent } from './dialog-content'

export function createDialog() {
  const useStore = create<CreateDialogStore>((set, get) => ({
    isOpen: false,
    callbacks: null,
    open: (callbacks) => {
      set({ isOpen: true, callbacks: callbacks ?? null })
    },
    close: (reason = 'outside') => {
      const state = get()
      if (state.callbacks?.onClose) {
        state.callbacks.onClose(reason)
      }
      set({ isOpen: false, callbacks: null })
    },
    ok: () => {
      const state = get()
      if (state.callbacks?.onOk) {
        state.callbacks.onOk()
      }
    },
  }))

  function Dialog(props: Omit<DialogProps, 'open' | 'onOpenChange'>) {
    const { children } = props
    const store = useStore()
    const { isOpen, close } = store
    const [labelId, setLabelId] = React.useState<string | undefined>()
    const [descriptionId, setDescriptionId] = React.useState<string | undefined>()
    const dismissReasonRef = React.useRef<DialogCloseReason>('outside')

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (!newOpen) {
          close(dismissReasonRef.current)
          dismissReasonRef.current = 'outside'
        } else {
          store.open()
        }
      },
      [store, close]
    )

    const data = useFloating({
      open: isOpen,
      onOpenChange: handleOpenChange,
    })

    const context = data.context

    const click = useClick(context, {
      enabled: false,
    })

    const dismiss = useDismiss(context, {
      outsidePressEvent: 'mousedown',
    })

    const role = useRole(context)
    const interactions = useInteractions([click, dismiss, role])

    React.useEffect(() => {
      if (!isOpen) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          dismissReasonRef.current = 'escape'
        }
      }

      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as Node
        const floatingElement = context.refs.floating.current
        if (floatingElement && !floatingElement.contains(target)) {
          dismissReasonRef.current = 'outside'
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleMouseDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('mousedown', handleMouseDown)
      }
    }, [isOpen, context.refs.floating])

    const dialogValue = React.useMemo(
      () => ({
        open: isOpen,
        setOpen: (newOpen: boolean) => handleOpenChange(newOpen),
        ...interactions,
        ...data,
        labelId,
        descriptionId,
        setLabelId,
        setDescriptionId,
        closeWithReason: (reason: DialogCloseReason) => {
          close(reason)
        },
      }),
      [isOpen, interactions, data, labelId, descriptionId, handleOpenChange, close]
    )

    return (
      <DialogProvider value={dialogValue}>
        <DialogContent className="Dialog">{children}</DialogContent>
      </DialogProvider>
    )
  }

  return {
    store: useStore,
    Dialog,
  }
}

export function useCreateDialog() {
  const dialogRef = React.useRef<ReturnType<typeof createDialog> | null>(null)

  // 使用 useMemo 在首次渲染时就创建 dialog 实例，避免 Fragment 导致的闪现
  // 这样 Dialog 和 store 始终存在，用户不需要判断 null/undefined
  const dialogInstance = React.useMemo(() => {
    dialogRef.current = createDialog()
    return dialogRef.current
  }, [])

  React.useEffect(() => {
    return () => {
      dialogRef.current?.store.getState().close()
      dialogRef.current = null
    }
  }, [])

  return {
    Dialog: dialogInstance.Dialog,
    store: dialogInstance.store,
  }
}
