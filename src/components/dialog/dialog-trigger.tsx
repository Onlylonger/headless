import { forwardRefPolymorphic } from '../../utils/polymorphic'
import { Button } from '../button'
import { useDialogContext } from './context'
import type { DialogTriggerImplProps, DialogTriggerOwnProps } from './types'
import { useMergeRefs } from '@floating-ui/react'
import { type ForwardedRef, type ElementType } from 'react'

function DialogTriggerImpl(props: DialogTriggerImplProps, propRef: ForwardedRef<any>) {
  const { component, children, ...rest } = props

  const context = useDialogContext()
  const Component: ElementType = component ?? Button
  const ref = useMergeRefs([context.refs.setReference, propRef as any])
  const referenceProps = context.getReferenceProps({
    ...rest,
    ref,
    'data-state': context.open ? 'open' : 'closed',
  } as any)

  return <Component {...referenceProps}>{children}</Component>
}

export const DialogTrigger = forwardRefPolymorphic<'button', DialogTriggerOwnProps>(
  DialogTriggerImpl
)
