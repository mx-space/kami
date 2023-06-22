'use client'

import { createTransitionView } from './factor'

export const BottomToUpTransitionView = createTransitionView({
  from: {
    translateY: '3rem',
    opacity: 0.0001,
  },
  to: {
    translateY: 0,
    opacity: 1,
  },
})
