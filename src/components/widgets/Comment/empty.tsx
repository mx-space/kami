import { EmptyIcon } from 'components/universal/Icons'
import { sample } from 'lodash-es'
import { FC, memo } from 'react'
import styles from './index.module.css'
import { minHeightProperty } from '.'

export const Empty: FC = memo(() => {
  return (
    <div style={{ ...minHeightProperty }} className={styles['empty']}>
      <EmptyIcon />
      {sample([
        '这里空空如也...',
        '客官, 感觉如何?',
        '嘿, 小可爱, 说点什么呢?',
      ])}
    </div>
  )
})
