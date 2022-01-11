import { useInitialData, useThemeConfig } from 'hooks/use-initial-data'
import { useFooterBackground } from 'hooks/use-theme-background'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { createElement, FC, Fragment, memo, useMemo } from 'react'
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
      <div className={'row mb-5'}>
        <div className="col-m-6 left to-center">
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
          <p>
            Powered by <a href="https://github.com/mx-space">{'mx-space'}</a>.
            Theme{' '}
            <a href="https://github.com/mx-space/kami" title={version}>
              {'Kami'}
            </a>
            {'. '}
            {icp.enable && !!icp.label && !!icp.link && (
              <a href={icp.link} target={'_blank'} rel={'noreferrer'}>
                {icp.label}
              </a>
            )}
          </p>
        </div>
        <div className="col-m-6 right to-center">
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
    </div>
  )
})
export const Footer = memo(() => {
  if (isServerSide()) {
    return null
  }
  return createElement(_Footer)
})
