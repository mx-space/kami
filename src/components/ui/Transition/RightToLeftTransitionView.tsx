'use client'

import { createTransitionView } from './factor'

export const RightToLeftTransitionView = createTransitionView({
  from: {
    translateX: '3em',
    opacity: 0.0001,
  },
  to: {
    translateX: 0,
    opacity: 1,
  },
})
