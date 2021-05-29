import { DetailedHTMLProps, HTMLAttributes, memo, useRef } from 'react'
import { NoSSR } from 'utils'
import styles from './index.module.css'
export const Switch = NoSSR(
  memo<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>(
    (props = {}) => {
      const containerRef = useRef<HTMLDivElement>(null)
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
              onClick={(_) => {
                if (containerRef.current) {
                  containerRef.current.style.top = '0'
                  setTimeout(() => {
                    try {
                      containerRef.current!.style.top = ''
                      // eslint-disable-next-line no-empty
                    } catch {}
                  }, 500)
                }
              }}
            ></div>
          </div>
        </div>
      )
    },
  ),
)
