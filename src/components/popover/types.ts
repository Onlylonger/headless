export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

export type Strategy = 'absolute' | 'fixed'

export interface Coords {
  x: number
  y: number
}

export interface MiddlewareState {
  placement: Placement
  referenceRect: DOMRect
  floatingRect: DOMRect
  coords: Coords
}

export interface Middleware {
  (coords: Coords, state: MiddlewareState): Coords | Promise<Coords>
}

export interface FlipOptions {
  fallbackPlacements?: Placement[]
  fallbackStrategy?: 'bestFit' | 'initialPlacement'
  padding?: number
}

export interface ShiftOptions {
  padding?: number
  limiter?: {
    fn: (state: MiddlewareState) => Coords
  }
}

export interface ComputePositionOptions {
  placement?: Placement
  strategy?: Strategy
  offset?: number
  middleware?: Middleware[]
}

export interface UseFloatingOptions extends ComputePositionOptions {
  whileElementsMounted?: (
    reference: HTMLElement,
    floating: HTMLElement,
    update: () => void
  ) => () => void
}

export interface UseFloatingReturn {
  x: number
  y: number
  placement: Placement
  strategy: Strategy
  update: () => void
  reference: (node: HTMLElement | null) => void
  floating: (node: HTMLElement | null) => void
}

export interface PopoverProps {
  /**
   * Whether the popover is open
   */
  open?: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Placement of the popover
   */
  placement?: Placement
  /**
   * Offset from reference element
   */
  offset?: number
  /**
   * Strategy for positioning
   */
  strategy?: Strategy
  /**
   * Reference element (trigger)
   */
  children: React.ReactElement
  /**
   * Content to display in the popover
   */
  content: React.ReactNode
  /**
   * Whether to show arrow
   */
  showArrow?: boolean
}
