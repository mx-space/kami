import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-cn'
import type { FC } from 'react'
import { useTranslations } from 'next-intl'

import { useLocale } from '~/i18n/navigation'
import { useMasterName } from '~/atoms/user'
import { Divider } from '~/components/ui/Divider'

import styles from './index.module.css'

const dayjsLocaleMap = { zh: 'zh-cn', en: 'en', ja: 'ja' } as const

export interface CopyrightProps {
  title: string
  link: string
  date?: string | null
}

export const Copyright: FC<CopyrightProps> = (props) => {
  const { title, link, date } = props
  const t = useTranslations('copyright')
  const locale = useLocale()
  const name = useMasterName()
  const dateLocale = dayjsLocaleMap[locale] ?? 'en'
  const formattedDate = date
    ? dayjs(date).locale(dateLocale).format('LLL')
    : t('noModified')
  return (
    <section className={styles['copyright-session']} id="copyright">
      <p>{t('title', { title })}</p>
      <p>{t('author', { name })}</p>
      <p>
        {t('link')}
        <span>{link}</span>{' '}
        <a
          onClick={() => {
            navigator.clipboard.writeText(link)
          }}
          data-hide-print
          className="select-none"
        >
          {t('copy')}
        </a>
      </p>
      <p>
        {t('lastModified')} {formattedDate}
      </p>
      <Divider />
      <div>
        <p>
          {t('license')}
          <br />
          {t('licenseIntro')}
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            {t('licenseName')}
          </a>
        </p>
      </div>
    </section>
  )
}
