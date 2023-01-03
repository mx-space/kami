import type { FC } from 'react'
import type { TransitionProps } from 'react-transition-group/Transition'

import type { BaseTransitionViewProps } from '../Transition/base'
import { BaseTransitionView } from '../Transition/base'

const defaultStyle = {
  transition: `transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 100ms ease-in-out`,
  transform: `scale(1) translateY(50px)`,
  opacity: 1,
}

const transitionStyles = {
  entering: { transform: `scale(1) translateY(50px)`, opacity: 1 },
  entered: { transform: `scale(1) translateY(0)`, opacity: 1 },
  exiting: { transform: `scale(0.5) translateY(0)`, opacity: 0.3 },
  exited: { transform: `scale(0.5) translateY(0)`, opacity: 0.3 },
}

export const ScaleModalTransition: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
