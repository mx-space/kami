import { clsx } from 'clsx'
import sample from 'lodash-es/sample'
import type { FC } from 'react'
import { memo } from 'react'

import { EmptyIcon } from '@mx-space/kami-design/components/Icons/for-comment'

import styles from './index.module.css'

export const Empty: FC = memo(() => {
  return (
    <div className={clsx(styles['empty'], 'min-h-[400px]')}>
      <EmptyIcon />
      {sample([
        '这里空空如也...不如，说点什么？',
        '看官, 有什么想说的吗？',
        '嘿, 小可爱, 说点什么呢？',
      ])}
    </div>
  )
})
