import { forwardRefPolymorphic } from '../../utils/polymorphic'
import { Button } from '../button'
import { usePopoverContext } from './context'
import type { PopoverTriggerImplProps, PopoverTriggerOwnProps } from './types'
import { useMergeRefs } from '@floating-ui/react'
import { type ForwardedRef, type ElementType } from 'react'

function PopoverTriggerImpl(props: PopoverTriggerImplProps, propRef: ForwardedRef<any>) {
  const { component, children, ...rest } = props

  const context = usePopoverContext()
  const Component: ElementType = component ?? Button
  const ref = useMergeRefs([context.refs.setReference, propRef as any])
  const referenceProps = context.getReferenceProps({
    ...rest,
    ref,
    'data-state': context.open ? 'open' : 'closed',
  } as any)

  return <Component {...referenceProps}>{children}</Component>
}

export const PopoverTrigger = forwardRefPolymorphic<'button', PopoverTriggerOwnProps>(
  PopoverTriggerImpl
)
