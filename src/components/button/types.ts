import type { ElementType, ComponentPropsWithoutRef } from 'react'

export interface ButtonProps<T extends ElementType = 'button'> {
  /**
   * The element or component to render
   */
  as?: T
  /**
   * Whether the button is in loading state
   * When true, the button will be disabled and have data-loading="true" attribute
   */
  loading?: boolean
  /**
   * Button type (only applies when as="button")
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Children content
   */
  children?: React.ReactNode
}

export type ButtonComponentProps<T extends ElementType = 'button'> = ButtonProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T> | 'type' | 'children'>
