import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import React, { Fragment, useCallback } from 'react'
import { useTranslations } from 'next-intl'

import Package from '~/../package.json'
import { useAppStore } from '~/atoms/app'
import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { ImpressionView } from '~/components/common/ImpressionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useInitialData, useThemeConfig } from '~/hooks/app/use-initial-data'
import { useFooterBackground } from '~/hooks/app/use-kami-theme'

import { FooterActions } from './actions'
import styles from './index.module.css'

const version = Package.version

const FooterContainer = (props) => {
  useFooterBackground(styles['footer'])

  return (
    <footer className={styles['footer']} id="app-footer">
      {props.children}
    </footer>
  )
}

export const FooterContent: FC = () => {
  const t = useTranslations('common')
  const thisYear = new Date().getFullYear()
  const initialData = useInitialData()
  const name = initialData.user.name
  const kamiConfig = useThemeConfig()
  const motto = kamiConfig.site.footer.motto

  const icp = kamiConfig.site.footer.icp
  const navigation = kamiConfig.site.footer.navigation

  const { event } = useAnalyze()
  const trackerToGithub = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '底部点击去 Github',
    })
  }, [])

  return (
    <div className={styles.wrap}>
      <div className="left to-center">
        <p>
          © {thisYear !== 2020 && '2020-'}
          {thisYear}{' '}
          <a href={kamiConfig.site.footer.homePage ?? '#'} target="_blank" rel="noreferrer">
            {name}
          </a>
          .{' '}
          <span title={`${motto.content} -- ${motto.author}`}>
            {motto.content}
          </span>
        </p>
        <ImpressionView trackerMessage={t('trackFooterExposure')}>
          <p className="children:flex-shrink-0 flex flex-wrap justify-center space-x-2">
            <span>Powered by </span>
            <a href="https://github.com/mx-space" onClick={trackerToGithub}>
              mx-space
            </a>
            .
            <a
              href="https://github.com/mx-space/kami"
              onClick={trackerToGithub}
              title={version}
            >
              Kami
            </a>
            .
            {icp.enable && !!icp.label && !!icp.link && (
              <div className="inline-block text-center">
                <a href={icp.link} target="_blank" rel="noreferrer">
                  {icp.label}
                </a>
              </div>
            )}
          </p>
        </ImpressionView>
      </div>
      <div className="right to-center">
        <p className="phone:mr-0 mr-12">
          {navigation.map((nav, i) => {
            return (
              <Fragment key={nav.name}>
                <Link
                  href={nav.path}
                  target={nav.newtab ? '_blank' : undefined}
                >
                  {nav.name}
                </Link>
                {i === navigation.length - 1 ? '' : ' · '}
              </Fragment>
            )
          })}
        </p>

        <p className="phone:mr-0 mr-12">
          <GatewayCount /> 个小伙伴正在浏览
        </p>
      </div>
    </div>
  )
}

const GatewayCount = () => {
  const gatewayCount = useAppStore((state) => state.gatewayOnline)
  return <>{gatewayCount || 1}</>
}
export const Footer = withNoSSR(() => {
  return (
    <FooterContainer>
      <FooterContent />
      <FooterActions />
    </FooterContainer>
  )
})
