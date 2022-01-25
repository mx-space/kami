import { FC } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'
import { BaseTransitionView, BaseTransitionViewProps } from './base'

const defaultStyle = {
  transition: `transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease`,
  transform: `translateY(3em)`,
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: `translateX(3em)`, opacity: 0 },
  entered: { transform: `translateX(0)`, opacity: 1 },
  exiting: { transform: `translateX(3em)`, opacity: 0 },
  exited: { transform: `translateX(3em)`, opacity: 0 },
}

export const RightLeftTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
