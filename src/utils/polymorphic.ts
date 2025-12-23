import * as React from 'react'

export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

export type PolymorphicComponentProps<C extends React.ElementType, OwnProps = {}> = OwnProps & {
  component?: C
} & Omit<React.ComponentPropsWithoutRef<C>, keyof OwnProps | 'component'>

/**
 * Helper to create polymorphic components with `forwardRef` without repeating `as ...` casts
 * at each component definition site.
 *
 * Note: React's `forwardRef` typings can't express a generic component signature directly,
 * so we centralize the one required cast here.
 */
export function forwardRefPolymorphic<DefaultC extends React.ElementType, OwnProps>(
  render: React.ForwardRefRenderFunction<any, any>
) {
  return React.forwardRef(render as any) as unknown as <C extends React.ElementType = DefaultC>(
    props: PolymorphicComponentProps<C, OwnProps> & { ref?: PolymorphicRef<C> }
  ) => React.ReactElement | null
}
