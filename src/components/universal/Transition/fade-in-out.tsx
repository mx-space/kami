import { genSpringKeyframes } from 'utils/spring'
import { BaseTransitionView } from './base'

const [name] = genSpringKeyframes(
  'fade-overlay',
  { opacity: 0 },
  { opacity: 1 },
)
const duration = 150

const defaultStyle = {
  transition: `opacity ${duration}ms ease-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { animation: `${name} 1000ms linear both` },
  exiting: { animation: `${name} 1000ms linear both reverse` },
  exited: { opacity: 0 },
}

export const FadeInOutTransitionView = BaseTransitionView(
  defaultStyle,
  transitionStyles,
)
