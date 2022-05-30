import type { FC } from 'react'
import type { TransitionProps } from 'react-transition-group/Transition'

import { genSpringKeyframes } from '~/utils/spring'

import type { BaseTransitionViewProps } from './base'
import { BaseTransitionView } from './base'

const name = `bottom-up-spring`
genSpringKeyframes(
  name,
  { translateY: '3em', opacity: 0 },
  { translateY: '0em', opacity: 1 },
)
const defaultStyle = {
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { animation: `${name} 1000ms steps(60) both`, opacity: 1 },
  exiting: { animation: `${name} 1000ms steps(60) both reverse`, opacity: 1 },
  exited: { opacity: 0 },
}

export const BottomUpTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles)
