import { FC } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'
import { BaseTransitionView, BaseTransitionViewProps } from './base'

const defaultStyle = {
  transition: `transform 500ms ease`,
  transform: `scale(0)`,
}

const transitionStyles = {
  entering: { transform: `scale(0)` },
  entered: { transform: `scale(1)` },
  exiting: { transform: `scale(0)` },
  exited: { transform: `scale(0)` },
}

export const ScaleTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
