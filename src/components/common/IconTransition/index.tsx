'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { FC } from 'react'
import { useId } from 'react'

import { FadeInOutTransitionView } from '~/components/ui/Transition/fade-in-out'

interface IconTransitionProps {
  solidIcon: JSX.Element
  regularIcon: JSX.Element
  currentState: 'solid' | 'regular'
}
export const IconTransition: FC<IconTransitionProps> = (props) => {
  const { currentState, regularIcon, solidIcon } = props
  const id = useId()
  return (
    <FadeInOutTransitionView key={currentState}>
      <AnimatePresence>
        {currentState === 'solid' ? (
          <motion.div layout layoutId={id}>
            {solidIcon}
          </motion.div>
        ) : (
          <motion.div layout layoutId={id}>
            {regularIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </FadeInOutTransitionView>
  )
}
