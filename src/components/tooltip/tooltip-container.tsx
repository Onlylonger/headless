import { Tooltip } from './tooltip'
import { TooltipContent } from './tooltip-content'
import { TooltipTrigger } from './tooltip-trigger'
import type { TooltipContainerProps } from './types'
import { isValidElement } from 'react'
import type { ReactElement } from 'react'

export function TooltipContainer(props: TooltipContainerProps) {
  const { title, children, disabled = false, placement, open, onOpenChange, ...restOptions } = props

  // 如果没有 title 或 disabled，直接返回 children
  if (!title || disabled) {
    return <>{children}</>
  }

  // 如果 children 是有效的 React 元素，使用 React 官方 API 提取属性
  if (isValidElement(children)) {
    const element = children as ReactElement
    // 使用 React 官方方式提取 props 和 type
    const triggerType = element.type
    const triggerProps = element.props
    const triggerChildren = triggerProps.children
    // ref 需要通过特殊方式访问（React 内部实现）
    const triggerRef = (element as any).ref

    return (
      <Tooltip placement={placement} open={open} onOpenChange={onOpenChange} {...restOptions}>
        <TooltipTrigger component={triggerType} ref={triggerRef} {...triggerProps}>
          {triggerChildren}
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    )
  }

  // 如果 children 不是有效的 React 元素，使用默认的 button
  return (
    <Tooltip placement={placement} open={open} onOpenChange={onOpenChange} {...restOptions}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )
}
