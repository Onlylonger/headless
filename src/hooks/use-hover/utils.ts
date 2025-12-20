// iOS 触摸设备问题：
// 1. 触摸操作本身不会触发 hover（pointerType="touch" 会被忽略）
// 2. 但是触摸后会触发一个模拟的鼠标事件（pointerType="mouse"）
// 3. 这个模拟事件会导致意外的 hover 行为
// 解决方案：在触摸后短时间内忽略模拟的鼠标事件
let globalIgnoreEmulatedMouseEvents = false
let hoverCount = 0

export function setGlobalIgnoreEmulatedMouseEvents() {
  globalIgnoreEmulatedMouseEvents = true
  setTimeout(() => {
    globalIgnoreEmulatedMouseEvents = false
  }, 50)
}

export function handleGlobalPointerEvent(e: PointerEvent) {
  if (e.pointerType === 'touch') {
    setGlobalIgnoreEmulatedMouseEvents()
  }
}

export function setupGlobalTouchEvents() {
  if (typeof document === 'undefined') {
    return
  }

  if (hoverCount === 0) {
    document.addEventListener('pointerup', handleGlobalPointerEvent)
  }

  hoverCount++
  return () => {
    hoverCount--
    if (hoverCount > 0) {
      return
    }

    document.removeEventListener('pointerup', handleGlobalPointerEvent)
  }
}

export function getOwnerDocument(element: Element | null): Document | null {
  if (!element) return null
  return element.ownerDocument || document
}

export function nodeContains(parent: Element | null, child: Element | null): boolean {
  if (!parent || !child) return false
  return parent === child || parent.contains(child)
}

export function getGlobalIgnoreEmulatedMouseEvents() {
  return globalIgnoreEmulatedMouseEvents
}
