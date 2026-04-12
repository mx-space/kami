import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { memo } from 'react'

import { EmptyIcon } from '~/components/ui/Icons/for-comment'
import { sample } from '~/utils/_'

import styles from './index.module.css'

export const Empty: FC = memo(() => {
  const t = useTranslations('comment')
  const emptyPhrases = t('emptyPhrases')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <div className={clsx(styles['empty'], 'min-h-[400px]')}>
      <EmptyIcon />
      {sample(emptyPhrases) ?? t('emptyHint')}
    </div>
  )
})
