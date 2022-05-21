import { useInitialData, useThemeConfig } from 'hooks/use-initial-data'
import { useFooterBackground } from 'hooks/use-theme-background'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import type { FC } from 'react'
import React, { Fragment, createElement, memo, useMemo } from 'react'
import { isServerSide } from 'utils'

import Package from '~/package.json'

import { useStore } from '../../../../store'
import { FooterActions } from './actions'
import styles from './index.module.css'

const version = Package.version

const FooterContainer = (props) => {
  useFooterBackground(styles['footer'])

  return <footer className={styles['footer']}>{props.children}</footer>
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
        <p className="justify-center flex space-x-2 children:flex-shrink-0 flex-wrap">
          <span>Powered by </span>
          <a href="https://github.com/mx-space">{'mx-space'}</a>.
          <a href="https://github.com/mx-space/kami" title={version}>
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
export const Footer = memo(() => {
  if (isServerSide()) {
    return null
  }
  return createElement(_Footer)
})
