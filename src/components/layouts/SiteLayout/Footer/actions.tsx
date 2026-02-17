import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'
import React, { useCallback, useDeferredValue, useMemo } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'
import { shallow } from 'zustand/shallow'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { useMusicStore } from '~/atoms/music'
import {
  BxBxsArrowToTop,
  FaSolidHeadphonesAlt,
  FaSolidLanguage,
} from '~/components/ui/Icons/for-footer'
import { flip, offset, shift } from '@floating-ui/react-dom'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { RootPortal } from '~/components/ui/Portal'
import { ScaleTransitionView } from '~/components/ui/Transition/ScaleTransitionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useDetectPadOrMobile,
  useIsOverFirstScreenHeight,
} from '~/hooks/ui/use-viewport'
import { locales } from '~/i18n/config'
import type { Locale } from '~/i18n/config'
import { useLocale, usePathname, useRouter } from '~/i18n/navigation'
import { springScrollToTop } from '~/utils/spring'

import styles from './actions.module.css'

const FooterActionsBase: FC<{
  children?: React.ReactNode
}> = (props) => {
  const t = useTranslations('common')
  const isOverFirstScreenHeight = useIsOverFirstScreenHeight()

  const isPadOrMobile = useDetectPadOrMobile()
  const { scrollDirection } = useAppStore(
    (state) => ({
      scrollDirection: state.scrollDirection,
    }),
    shallow,
  )

  const shouldHideActionButtons = useMemo(() => {
    if (!isPadOrMobile) {
      return false
    }

    return isOverFirstScreenHeight && scrollDirection == 'down'
  }, [isOverFirstScreenHeight, isPadOrMobile, scrollDirection])

  const { event } = useAnalyze()

  const toTop = useCallback(() => {
    springScrollToTop()
    event({
      action: TrackerAction.Click,
      label: t('trackBackToTop'),
    })
  }, [event, t])

  return (
    <div
      className={clsx(
        styles.action,
        shouldHideActionButtons && styles['hidden'],
      )}
    >
      <button
        aria-label="to top"
        className={clsx(
          styles['top'],
          isOverFirstScreenHeight ? styles['active'] : '',
        )}
        onClick={toTop}
      >
        <BxBxsArrowToTop />
      </button>

      {props.children}
    </div>
  )
}

const FooterActionButton: FC<
  PropsWithChildren<{ onClick?: () => any; label?: string }>
> = ({ children, onClick, label }) => {
  return (
    <motion.button
      aria-label={label}
      onClick={onClick}
      whileTap={{
        scale: 0.9,
      }}
      whileHover={{
        scale: 1.05,
      }}
    >
      {children}
    </motion.button>
  )
}

const LocaleSwitcherFAB: FC = () => {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const localeLabels: Record<Locale, string> = useMemo(
    () => ({
      zh: t('locale_zh'),
      en: t('locale_en'),
      ja: t('locale_ja'),
    }),
    [t],
  )

  const languages = useMemo(
    () =>
      locales.map((l) => ({
        code: l,
        label: localeLabels[l],
      })),
    [localeLabels],
  )

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) return
      if (typeof document !== 'undefined') {
        const secure =
          typeof location !== 'undefined' && location.protocol === 'https:'
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax${secure ? '; Secure' : ''}`
      }
      router.push(pathname, { locale: newLocale, shallow: true })
    },
    [locale, pathname, router],
  )

  if (languages.length <= 1) {
    return null
  }

  const selectLanguageLabel = t('selectLanguage')

  return (
    <FloatPopover
      trigger="click"
      placement="top-start"
      headless
      middleware={[
        flip({ padding: 20 }),
        offset({ mainAxis: 10, crossAxis: -32 }),
        shift(),
      ]}
      triggerComponent={() => (
        <motion.button
          type="button"
          aria-label={selectLanguageLabel}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <FaSolidLanguage />
        </motion.button>
      )}
      wrapperClassNames={styles.actionItem}
      popoverWrapperClassNames="min-w-[10rem]"
    >
      <ul
        className="list-none rounded-lg bg-light-bg p-2 shadow-out-sm"
        role="listbox"
        aria-label={selectLanguageLabel}
      >
        {languages.map((lang) => {
          const isCurrent = lang.code === locale
          return (
            <li
              key={lang.code}
              role="option"
              aria-selected={isCurrent}
              className={clsx(
                'flex w-full cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                isCurrent
                  ? 'bg-base-200 text-gray-1 dark:bg-base-300'
                  : 'text-gray-2 hover:bg-base-200 dark:hover:bg-base-300',
              )}
              onClick={() => handleLocaleChange(lang.code)}
            >
              <span>{lang.label}</span>
              {isCurrent && (
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </FloatPopover>
  )
}

export const FooterActions: FC = () => {
  const t = useTranslations('common')
  const { event } = useAnalyze()

  const handlePlayMusic = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: `底部播放器点击`,
    })
    const musicStore = useMusicStore.getState()
    const nextStatus = !musicStore.isHide
    musicStore.setHide(nextStatus)
    musicStore.setPlay(!nextStatus)
  }, [event])

  useShortcut(
    'P',
    [Modifier.Command, Modifier.Shift],
    handlePlayMusic,
    t('trackPlayMusic'),
  )

  const actions = useDeferredValue(useActionStore((state) => state.actions))

  return (
    <RootPortal>
      <FooterActionsBase>
        <AnimatePresence>
          {actions.map((action) => {
            const El = action.element ?? (
              <FooterActionButton
                aria-label="footer action button"
                onClick={action.onClick}
              >
                {action.icon}
              </FooterActionButton>
            )

            return (
              <ScaleTransitionView
                layoutId={action.id}
                layout
                duration={0.3}
                key={action.id}
              >
                {El}
              </ScaleTransitionView>
            )
          })}
        </AnimatePresence>

        <LocaleSwitcherFAB />
        <FooterActionButton aria-label="open player" onClick={handlePlayMusic}>
          <FaSolidHeadphonesAlt />
        </FooterActionButton>
      </FooterActionsBase>
    </RootPortal>
  )
}
