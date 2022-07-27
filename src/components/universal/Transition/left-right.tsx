import type { FC } from 'react'
import type { TransitionProps } from 'react-transition-group/Transition'

import { genSpringKeyframes } from '~/utils/spring'

import type { BaseTransitionViewProps } from './base'
import { BaseTransitionView } from './base'

const name = `left-right-spring`

const defaultStyle = {
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { animation: `${name} 1000ms linear both` },
  exiting: { animation: `${name} 1000ms linear both reverse` },
  exited: { opacity: 0 },
}

export const LeftRightTransitionView: FC<
  BaseTransitionViewProps & Partial<TransitionProps>
> = BaseTransitionView(defaultStyle, transitionStyles, () =>
  genSpringKeyframes(
    name,
    { translateX: '-3em', opacity: 0 },
    { translateX: '0em', opacity: 1 },
  ),
)
