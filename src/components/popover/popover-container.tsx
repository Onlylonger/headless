import { Popover } from './popover'
import { PopoverContent } from './popover-content'
import { PopoverTrigger } from './popover-trigger'
import type { PopoverContainerProps } from './types'
import { isValidElement } from 'react'
import type { ReactElement } from 'react'

export function PopoverContainer(props: PopoverContainerProps) {
  const {
    content,
    children,
    disabled = false,
    placement,
    open,
    onOpenChange,
    modal,
    ...restOptions
  } = props

  // 如果没有 content 或 disabled，直接返回 children
  if (!content || disabled) {
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
      <Popover
        placement={placement}
        open={open}
        onOpenChange={onOpenChange}
        modal={modal}
        {...restOptions}
      >
        <PopoverTrigger component={triggerType} ref={triggerRef} {...triggerProps}>
          {triggerChildren}
        </PopoverTrigger>
        <PopoverContent>{content}</PopoverContent>
      </Popover>
    )
  }

  // 如果 children 不是有效的 React 元素，使用默认的 button
  return (
    <Popover
      placement={placement}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      {...restOptions}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  )
}
