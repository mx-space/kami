import { FC, DetailedHTMLProps, HTMLAttributes } from 'react'
import styles from './index.module.scss'
export const PullSelect: FC<DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>> = (props = {}) => {
  return (
    <div className={styles['select-container']}>
      <div className={styles['select-line']}>
        <div className={styles['line']}></div>
      </div>
      <div className={styles['sakura-wrap']} {...props}>
        <div className={styles['sakura-img']}></div>
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
