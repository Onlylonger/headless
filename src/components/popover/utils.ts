import type {
  Placement,
  Coords,
  MiddlewareState,
  Middleware,
  FlipOptions,
  ShiftOptions,
  ComputePositionOptions,
} from './types'

// Get base placement (top, bottom, left, right)
function getBasePlacement(placement: Placement): 'top' | 'bottom' | 'left' | 'right' {
  return placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right'
}

// Get variation (start, end, or null for center)
function getVariation(placement: Placement): 'start' | 'end' | null {
  const parts = placement.split('-')
  if (parts.length > 1) {
    return parts[1] as 'start' | 'end'
  }
  return null
}

// Get main axis from placement
function getMainAxisFromPlacement(placement: Placement): 'x' | 'y' {
  return ['top', 'bottom'].includes(getBasePlacement(placement)) ? 'y' : 'x'
}

// Get opposite placement
function getOppositePlacement(placement: Placement): Placement {
  const hash: Record<string, string> = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }
  return placement.replace(/left|right|bottom|top/g, (matched) => hash[matched]) as Placement
}

// Compute offsets based on t-ui's computeOffsets algorithm
function computeOffsets(
  placement: Placement,
  referenceRect: DOMRect,
  floatingRect: DOMRect
): Coords {
  const basePlacement = getBasePlacement(placement)
  const variation = getVariation(placement)

  // Calculate common center position
  const commonX = referenceRect.left + referenceRect.width / 2 - floatingRect.width / 2
  const commonY = referenceRect.top + referenceRect.height / 2 - floatingRect.height / 2

  let offsets: Coords

  // Calculate base position based on placement
  switch (basePlacement) {
    case 'top':
      offsets = {
        x: commonX,
        y: referenceRect.top - floatingRect.height,
      }
      break
    case 'bottom':
      offsets = {
        x: commonX,
        y: referenceRect.top + referenceRect.height,
      }
      break
    case 'right':
      offsets = {
        x: referenceRect.left + referenceRect.width,
        y: commonY,
      }
      break
    case 'left':
      offsets = {
        x: referenceRect.left - floatingRect.width,
        y: commonY,
      }
      break
    default:
      offsets = { x: referenceRect.left, y: referenceRect.top }
  }

  // Adjust for variation (start/end alignment)
  const mainAxis = getMainAxisFromPlacement(placement)
  if (mainAxis !== null && variation) {
    const len = mainAxis === 'y' ? 'height' : 'width'
    const referenceLen = len === 'height' ? referenceRect.height : referenceRect.width
    const floatingLen = len === 'height' ? floatingRect.height : floatingRect.width

    if (variation === 'start') {
      offsets[mainAxis] = offsets[mainAxis] - (referenceLen / 2 - floatingLen / 2)
    } else if (variation === 'end') {
      offsets[mainAxis] = offsets[mainAxis] + (referenceLen / 2 - floatingLen / 2)
    }
  }

  return offsets
}

export function computePosition(
  reference: HTMLElement,
  floating: HTMLElement,
  options: ComputePositionOptions = {}
): Coords {
  const { placement = 'bottom', offset = 0, middleware = [] } = options

  const referenceRect = reference.getBoundingClientRect()
  const floatingRect = floating.getBoundingClientRect()

  // Compute base offsets using t-ui's algorithm
  let coords = computeOffsets(placement, referenceRect, floatingRect)

  // Apply offset
  const basePlacement = getBasePlacement(placement)
  const invertDistance = ['left', 'top'].includes(basePlacement) ? -1 : 1
  const distance = offset * invertDistance

  if (['left', 'right'].includes(basePlacement)) {
    coords.x += distance
  } else {
    coords.y += distance
  }

  // Apply middleware
  const state: MiddlewareState = {
    placement,
    referenceRect,
    floatingRect,
    coords,
  }

  for (const mw of middleware) {
    const result = mw(coords, state)
    // Handle both sync and async middleware
    if (result instanceof Promise) {
      // For now, we only support sync middleware
      // In a full implementation, we'd need to handle async
      continue
    }
    coords = result
  }

  return coords
}

export function flip(options: FlipOptions = {}): Middleware {
  const { fallbackPlacements = [], padding = 0 } = options

  return (coords: Coords, state: MiddlewareState) => {
    const { placement, floatingRect, referenceRect } = state
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Check overflow
    const overflow = {
      top: coords.y < padding,
      bottom: coords.y + floatingRect.height > viewport.height - padding,
      left: coords.x < padding,
      right: coords.x + floatingRect.width > viewport.width - padding,
    }

    // Determine if we should flip
    const shouldFlip =
      (placement.startsWith('top') && overflow.top && !overflow.bottom) ||
      (placement.startsWith('bottom') && overflow.bottom && !overflow.top) ||
      (placement.startsWith('left') && overflow.left && !overflow.right) ||
      (placement.startsWith('right') && overflow.right && !overflow.left)

    if (shouldFlip) {
      const opposite = getOppositePlacement(placement)
      const newPlacement = fallbackPlacements.length > 0 ? fallbackPlacements[0] : opposite
      return computeOffsets(newPlacement, referenceRect, floatingRect)
    }

    return coords
  }
}

export function shift(options: ShiftOptions = {}): Middleware {
  const { padding = 0 } = options

  return (coords: Coords, state: MiddlewareState) => {
    const { floatingRect } = state
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Ensure floating element stays within viewport
    const x = Math.max(padding, Math.min(coords.x, viewport.width - floatingRect.width - padding))
    const y = Math.max(padding, Math.min(coords.y, viewport.height - floatingRect.height - padding))

    return { x, y }
  }
}
