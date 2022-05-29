import type { ElementType, FC } from 'react'
import { Transition } from 'react-transition-group'
import type { TransitionProps } from 'react-transition-group/Transition'

export interface BaseTransitionViewProps {
  id?: string
  className?: string
  component?: ElementType
}

export const BaseTransitionView: (
  defaultStyle: any,
  transitionStyles: any,
) => FC<BaseTransitionViewProps & Partial<TransitionProps>> =
  (defaultStyle, transitionStyles) => (props) => {
    const { id, className, component: Component = 'div', ...rest } = props
    return (
      <Transition
        key={id}
        in
        appear
        mountOnEnter
        unmountOnExit
        timeout={0}
        {...rest}
      >
        {(state) => {
          return (
            <Component
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              className={className}
            >
              {props.children}
            </Component>
          )
        }}
      </Transition>
    )
  }
