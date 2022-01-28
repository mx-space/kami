import { FC } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'
import { genSpringKeyframes } from 'utils/spring'
import { BaseTransitionView, BaseTransitionViewProps } from './base'
const name = `right-left-spring`

genSpringKeyframes(
  name,
  { translateX: '3em', opacity: 0 },
  { translateX: '0em', opacity: 1 },
)

const defaultStyle = {
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { animation: `${name} 1000ms linear both` },
  exiting: { animation: `${name} 1000ms linear both reverse` },
  exited: { opacity: 0 },
}

export const RightLeftTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
