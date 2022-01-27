import { FC } from 'react'
import { Transition } from 'react-transition-group'
import { TransitionProps } from 'react-transition-group/Transition'

export interface BaseTransitionViewProps {
  id?: string
  className?: string
}

export const BaseTransitionView: (
  defaultStyle: any,
  transitionStyles: any,
) => FC<BaseTransitionViewProps & Partial<TransitionProps>> =
  (defaultStyle, transitionStyles) => (props) => {
    const { id, className, ...rest } = props
    return (
      <Transition
        key={id}
        in={true}
        appear
        mountOnEnter
        unmountOnExit
        timeout={0}
        {...rest}
      >
        {(state) => {
          return (
            <div
              style={{
                ...defaultStyle,
                ...transitionStyles[state],
              }}
              className={className}
            >
              {props.children}
            </div>
          )
        }}
      </Transition>
    )
  }
