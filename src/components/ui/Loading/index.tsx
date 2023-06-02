import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { useIsClient } from '~/hooks/common/use-is-client'

import styles from './index.module.css'

export type LoadingProps = {
  loadingText?: string
}

export const Loading: FC<LoadingProps> = ({ loadingText }) => {
  const [pause, setPause] = useState(true)
  const { ref } = useInView({
    threshold: 0.5,
    onChange(inView) {
      if (inView) {
        setPause(false)
      } else {
        setPause(true)
      }
    },
  })

  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <div className={styles['loading']} ref={ref}>
      <div className="icon" key="icon">
        <svg
          className="m-auto block bg-transparent"
          width="200px"
          height="200px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle cx="50" cy="51.3828" r="13" fill="#e15b64">
            {!pause && (
              <animate
                attributeName="cy"
                dur="1s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
                keyTimes="0;0.5;1"
                values="23;77;23"
              />
            )}
          </circle>
        </svg>
      </div>
      <span>{loadingText}</span>
    </div>
  )
}
