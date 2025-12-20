export interface HoverEvent {
  type: 'hoverstart' | 'hoverend'
  target: Element
  pointerType: 'mouse' | 'touch' | 'pen'
}

export interface UseHoverOptions {
  onHoverStart?: (e: HoverEvent) => void
  onHoverChange?: (isHovered: boolean) => void
  onHoverEnd?: (e: HoverEvent) => void
  isDisabled?: boolean
}

export interface UseHoverReturn {
  isHovered: boolean
  hoverProps: {
    onPointerEnter: (e: React.PointerEvent) => void
    onPointerLeave: (e: React.PointerEvent) => void
    'data-hover': boolean
  }
}
