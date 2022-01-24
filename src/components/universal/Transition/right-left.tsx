import { FC } from 'react'
import { Transition } from 'react-transition-group'
import { TransitionProps } from 'react-transition-group/Transition'

export interface RightLeftTransitionViewProps {
  id?: string
}
const defaultStyle = {
  transition: `transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease`,
  transform: `translateY(3em)`,
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: `translateX(3em)`, opacity: 0 },
  entered: { transform: `translateX(0)`, opacity: 1 },
  exiting: { transform: `translateX(0)`, opacity: 1 },
  exited: { transform: `translateX(3em)`, opacity: 0 },
}

export const RightTopTransitionView: FC<
  RightLeftTransitionViewProps & Partial<TransitionProps>
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
