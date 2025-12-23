import * as React from 'react'
import { useMergeRefs } from '@floating-ui/react'
import { useDialogContext } from './context'
import { forwardRefPolymorphic } from '../../utils/polymorphic'
import type { DialogTriggerImplProps, DialogTriggerOwnProps } from './types'
import { Button } from '../button'

function DialogTriggerImpl(props: DialogTriggerImplProps, propRef: React.ForwardedRef<any>) {
  const { component, children, ...rest } = props
  const context = useDialogContext()
  const Component: React.ElementType = component ?? Button

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
