import { FC } from 'react'
import { Transition } from 'react-transition-group'
import { TransitionProps } from 'react-transition-group/Transition'

export interface BottomUpTransitionViewProps {
  id?: string
}
const defaultStyle = {
  transition: `transform ${280}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease`,
  transform: `translateY(3em)`,
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: `translateY(3em)`, opacity: 0 },
  entered: { transform: `translateY(0)`, opacity: 1 },
  exiting: { transform: `translateY(0)`, opacity: 1 },
  exited: { transform: `translateY(3em)`, opacity: 0 },
}

export const BottomUpTransitionView: FC<
  BottomUpTransitionViewProps & Partial<TransitionProps>
> = (props) => {
  const { id, ...rest } = props
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
          >
            {props.children}
          </div>
        )
      }}
    </Transition>
  )
}
