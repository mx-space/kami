import { FC, memo } from 'react'
import styles from './index.module.css'

export const Loading: FC<{ loadingText?: string }> = memo(({ loadingText }) => {
  return (
    <div className={styles['loading']}>
      <div className="icon">
        <svg
          style={{
            margin: 'auto',
            background: 'transparent',
            display: 'block',
          }}
          width="200px"
          height="200px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle cx="50" cy="51.3828" r="13" fill="#e15b64">
            <animate
              attributeName="cy"
              dur="1s"
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.45 0 0.9 0.55;0 0.45 0.55 0.9"
              keyTimes="0;0.5;1"
              values="23;77;23"
            ></animate>
          </circle>
        </svg>
      </div>
      <span>{loadingText}</span>
    </div>
  )
})
