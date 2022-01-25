import { FC } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'
import { BaseTransitionView, BaseTransitionViewProps } from './base'

const defaultStyle = {
  transition: `transform ${280}ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease`,
  transform: `translateY(3em)`,
  opacity: 0,
}

const transitionStyles = {
  entering: { transform: `translateY(3em)`, opacity: 0 },
  entered: { transform: `translateY(0)`, opacity: 1 },
  exiting: { transform: `translateY(3em)`, opacity: 0 },
  exited: { transform: `translateY(3em)`, opacity: 0 },
}

export const BottomUpTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
