import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { memo, useRef } from 'react'
import { NoSSR } from 'utils'

import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { genSpringKeyframes } from '~/utils/spring'

import styles from './index.module.css'

const [down] = genSpringKeyframes(
  'sakura',
  {
    translateY: '0vh',
  },
  {
    translateY: '10vh',
  },
)

const [up] = genSpringKeyframes(
  'sakura-up',
  {
    translateY: '10vh',
  },
  {
    translateY: '0',
  },
)
export const LampSwitch = NoSSR(
  memo<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>(
    (props = {}) => {
      const containerRef = useRef<HTMLDivElement>(null)

      const { event } = useAnalyze()
      return (
        <div
          className={styles['select-container']}
          ref={containerRef}
          data-hide-print
        >
          <div className={styles['select-line']}>
            <div className={styles['line']}></div>
          </div>
          <div className={styles['sakura-wrap']} {...props}>
            <div
              className={styles['sakura-img']}
              onClick={() => {
                event({
                  action: TrackerAction.Interaction,
                  label: `颜色切换`,
                })
                if (containerRef.current) {
                  // containerRef.current.style.top = '0'
                  containerRef.current.style.animation = `${down} .5s steps(60) both`
                  containerRef.current.onanimationend = () => {
                    if (containerRef.current) {
                      containerRef.current.style.animation = `${up} .5s steps(60) both`

                      containerRef.current.onanimationend = () => {
                        containerRef.current!.style.animation = ''
                      }
                    }
                  }
                }
              }}
            ></div>
          </div>
        </div>
      )
    },
  ),
)
