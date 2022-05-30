import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import React, { Fragment, useCallback, useMemo } from 'react'

import Package from '~/../package.json'
import { ImpressionView } from '~/components/universal/ImpressionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useInitialData, useThemeConfig } from '~/hooks/use-initial-data'
import { useFooterBackground } from '~/hooks/use-theme-background'
import { NoSSR } from '~/utils'

import { useStore } from '../../../../store'
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

const _Footer: FC = observer(() => {
  return (
    <FooterContainer>
      <FooterContent />
      <FooterActions />
    </FooterContainer>
  )
})

export const FooterContent: FC = observer(() => {
  const { gatewayStore } = useStore()
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
          <a href={kamiConfig.site.footer.homePage ?? '#'} target="_blank">
            {name}
          </a>
          .{' '}
          <span title={`${motto.content} -- ${motto.author}`}>
            {motto.content}
          </span>
        </p>
        <ImpressionView trackerMessage="底部曝光">
          <p className="justify-center flex space-x-2 children:flex-shrink-0 flex-wrap">
            <span>Powered by </span>
            <a href="https://github.com/mx-space" onClick={trackerToGithub}>
              {'mx-space'}
            </a>
            .
            <a
              href="https://github.com/mx-space/kami"
              onClick={trackerToGithub}
              title={version}
            >
              {'Kami'}
            </a>
            {'.'}
            {icp.enable && !!icp.label && !!icp.link && (
              <div className="text-center inline-block">
                <a href={icp.link} target={'_blank'} rel={'noreferrer'}>
                  {icp.label}
                </a>
              </div>
            )}
          </p>
        </ImpressionView>
      </div>
      <div className="right to-center">
        <p className={'phone:mr-0 mr-12'}>
          {navigation.map((nav, i) => {
            return (
              <Fragment key={nav.name}>
                <Link href={nav.path}>
                  <a target={nav.newtab ? '_blank' : undefined}>{nav.name}</a>
                </Link>
                {i === navigation.length - 1 ? '' : ' · '}
              </Fragment>
            )
          })}
        </p>
        {useMemo(
          () => (
            <p className={'mr-12 phone:mr-0'}>
              {gatewayStore.online || 1} 个小伙伴正在浏览
            </p>
          ),
          [gatewayStore.online],
        )}
      </div>
    </div>
  )
})
export const Footer = NoSSR(_Footer)
