'use client'

import { createTransitionView } from './factor'

export const ScaleTransitionView = createTransitionView({
  from: {
    scale: 0,
    opacity: 0.0001,
  },
  to: {
    scale: 1,
    opacity: 1,
  },
})
