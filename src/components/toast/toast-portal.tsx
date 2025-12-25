import { FloatingPortal } from '@floating-ui/react'
import type { ReactNode } from 'react'

export type ToastPortalProps = {
  children?: ReactNode
  /**
   * Container element for the portal
   */
  container?: HTMLElement | null
}

export function ToastPortal(props: ToastPortalProps) {
  const { children, container } = props

  return <FloatingPortal root={container}>{children}</FloatingPortal>
}
