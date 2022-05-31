import { BaseTransitionView } from './base'

const duration = 300

const defaultStyle = {
  transition: `opacity ${duration}ms ease-out`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
}

export const FadeInOutTransitionView = BaseTransitionView(
  defaultStyle,
  transitionStyles,
)
