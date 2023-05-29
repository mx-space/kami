'use client'

import { createTransitionView } from '../Transition/factor'

export const ScaleModalTransition = createTransitionView({
  from: {
    scale: 0.95,
    opacity: 0,
  },
  to: {
    scale: 1,
    opacity: 1,
  },
})
