import type { PopoverOptions } from './types'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useHover,
} from '@floating-ui/react'
import { useState, useMemo } from 'react'

export function usePopover(props: PopoverOptions = {}) {
  const {
    initialOpen = false,
    placement = 'bottom',
    trigger = 'click',
    modal,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
  } = props

  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen)
  const [labelId, setLabelId] = useState<string | undefined>()
  const [descriptionId, setDescriptionId] = useState<string | undefined>()

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'end',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  })

  const context = data.context

  const click = useClick(context, {
    enabled: controlledOpen == null && trigger === 'click',
  })
  const hover = useHover(context, {
    enabled: controlledOpen == null && trigger === 'hover',
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)

  const interactions = useInteractions([hover, click, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  )
}
