import type { FC } from 'react'
import { SwitchTransition } from 'react-transition-group'

import { FadeInOutTransitionView } from '../Transition/fade-in-out'

interface IconTransitionProps {
  solidIcon: JSX.Element
  regularIcon: JSX.Element
  currentState: 'solid' | 'regular'
}
export const IconTransition: FC<IconTransitionProps> = (props) => {
  const { currentState, regularIcon, solidIcon } = props

  return (
    <SwitchTransition mode="in-out">
      <FadeInOutTransitionView
        key={currentState}
        addEndListener={(node, done) =>
          node.addEventListener('transitionend', done, false)
        }
      >
        {currentState === 'solid' ? solidIcon : regularIcon}
      </FadeInOutTransitionView>
    </SwitchTransition>
  )
}
