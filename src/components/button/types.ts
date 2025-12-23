import type * as React from 'react'
import type { ElementType } from 'react'
import type { PolymorphicComponentProps } from '../../utils/polymorphic'

export interface ButtonOwnProps {
  /**
   * Whether the button is in loading state
   * When true, the button will be disabled and have data-loading="true" attribute
   */
  loading?: boolean
  /**
   * Button type (only applies when component="button" or component is not specified)
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Children content
   */
  children?: React.ReactNode
}

export type ButtonComponentProps<T extends ElementType = 'button'> = PolymorphicComponentProps<
  T,
  ButtonOwnProps
>

export type ButtonProps<T extends ElementType = 'button'> = ButtonComponentProps<T>
