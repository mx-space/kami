import { FC, DetailedHTMLProps, HTMLAttributes, useRef } from 'react'
import styles from './index.module.scss'
export const PullSelect: FC<DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = (props = {}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div className={styles['select-container']} ref={containerRef}>
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
              }, 1000)
            }
          }}
        ></div>
      </div>
    </div>
  )
}

const Sakura: FC = () => (
  <div className={styles['sakura-wrap']}>
    <div className={styles['sakura']}>
      <div className={styles['blossom']}></div>
      <div className={styles['petals']}>
        <div className={styles['petal']}></div>
        <div className={styles['petal']}></div>
        <div className={styles['petal']}></div>
        <div className={styles['petal']}></div>
        <div className={styles['petal']}></div>
        <div className={styles['petal']}></div>
      </div>
    </div>
  </div>
)
