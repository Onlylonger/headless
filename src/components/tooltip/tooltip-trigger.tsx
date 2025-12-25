import { forwardRefPolymorphic } from '../../utils/polymorphic'
import { Button } from '../button'
import { useTooltipContext } from './context'
import type { TooltipTriggerImplProps, TooltipTriggerOwnProps } from './types'
import { useMergeRefs } from '@floating-ui/react'
import { type ForwardedRef, type ElementType } from 'react'

function TooltipTriggerImpl(props: TooltipTriggerImplProps, propRef: ForwardedRef<any>) {
  const { component, children, ...rest } = props

  const context = useTooltipContext()
  const Component: ElementType = component ?? Button
  const ref = useMergeRefs([context.refs.setReference, propRef as any])
  const referenceProps = context.getReferenceProps({
    ...rest,
    ref,
    'data-state': context.open ? 'open' : 'closed',
  } as any)

  return <Component {...referenceProps}>{children}</Component>
}

export const TooltipTrigger = forwardRefPolymorphic<'button', TooltipTriggerOwnProps>(
  TooltipTriggerImpl
)
