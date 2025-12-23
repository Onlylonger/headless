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
    // 优化1: 使用 selector 只订阅需要的字段，避免不必要的重渲染
    const isOpen = useStore((state) => state.isOpen)
    const close = useStore((state) => state.close)
    const open = useStore((state) => state.open)

    const [labelId, setLabelId] = React.useState<string | undefined>()
    const [descriptionId, setDescriptionId] = React.useState<string | undefined>()
    const dismissReasonRef = React.useRef<DialogCloseReason>('outside')

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        if (!newOpen) {
          close(dismissReasonRef.current)
          dismissReasonRef.current = 'outside'
        } else {
          open()
        }
      },
      [open, close]
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

    // 优化2: 使用 ref 稳定 floating element 引用，避免事件监听器频繁注册/移除
    const floatingElementRef = React.useRef<HTMLElement | null>(null)
    React.useEffect(() => {
      floatingElementRef.current = context.refs.floating.current
    })

    React.useEffect(() => {
      if (!isOpen) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          dismissReasonRef.current = 'escape'
        }
      }

      const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as Node
        const floatingElement = floatingElementRef.current
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
    }, [isOpen]) // 移除 context.refs.floating 依赖

    // 优化3: 稳定 closeWithReason 回调，避免每次渲染都创建新函数
    const closeWithReason = React.useCallback(
      (reason: DialogCloseReason) => {
        close(reason)
      },
      [close]
    )

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
        closeWithReason,
      }),
      [isOpen, interactions, data, labelId, descriptionId, handleOpenChange, closeWithReason]
    )

    return (
      <DialogProvider value={dialogValue}>
        <DialogContent className="Dialog">{children}</DialogContent>
      </DialogProvider>
    )
  }

  // 优化4: 创建便捷的 store API，避免用户需要调用 getState()
  const storeApi = {
    get isOpen() {
      return useStore.getState().isOpen
    },
    open: (callbacks?: Parameters<CreateDialogStore['open']>[0]) => {
      useStore.getState().open(callbacks)
    },
    close: (reason?: DialogCloseReason) => {
      useStore.getState().close(reason)
    },
    ok: () => {
      useStore.getState().ok()
    },
    // 保留原始 store 以供高级用法
    _store: useStore,
  }

  return {
    store: storeApi,
    Dialog,
  }
}

export function useCreateDialog() {
  const dialogRef = React.useRef<ReturnType<typeof createDialog> | null>(null)

  // 使用 useMemo 在首次渲染时就创建 dialog 实例，避免 Fragment 导致的闪现
  // 这样 Dialog 和 store 始终存在，用户不需要判断 null/undefined
  const dialogInstance = React.useMemo(() => {
    dialogRef.current = dialogRef.current ?? createDialog()
    return dialogRef.current
  }, [])

  React.useEffect(() => {
    return () => {
      dialogRef.current?.store.close()
      dialogRef.current = null
    }
  }, [])

  return {
    Dialog: dialogInstance.Dialog,
    store: dialogInstance.store,
  }
}
