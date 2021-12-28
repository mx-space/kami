import { faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useInitialData, useThemeConfig } from 'common/hooks/use-initial-data'
import Link from 'next/link'
import React, { FC } from 'react'
import { NoSSR } from 'utils'
import { observer } from 'utils/mobx'
import Package from '~/package.json'
import { useStore } from '../../common/store'
import { FooterActions } from './actions'
import styles from './index.module.css'

const version = Package.version

const _Footer: FC = observer(() => {
  const { appStore, gatewayStore } = useStore()
  const thisYear = new Date().getFullYear()
  const initialData = useInitialData()
  const name = initialData.user.name
  const kamiConfig = useThemeConfig()
  const motto = kamiConfig.site.footer.motto
  const { colorMode } = appStore
  const background = kamiConfig.site.footer.background
  const icp = kamiConfig.site.footer.icp
  const navigation = kamiConfig.site.footer.navigation

  return (
    <footer
      className={styles['footer']}
      style={
        {
          '--bg':
            colorMode == 'dark'
              ? `url(${background.src.dark || background.src.light}) ${
                  background.position
                }`
              : `url(${background.src.light || background.src.dark}) ${
                  background.position
                }`,
        } as any
      }
    >
      <div className="wrap">
        <div className={'row'} style={{ paddingBottom: '18px' }}>
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
              Powered by <FontAwesomeIcon icon={faReact} />
              <a href="https://github.com/mx-space" title={'版本: ' + version}>
                {' mx-space '}
              </a>
              <FontAwesomeIcon icon={faNodeJs} />.{' '}
              {icp.enable && !!icp.label && !!icp.link && (
                <a href={icp.link} target={'_blank'} rel={'noreferrer'}>
                  {icp.label}
                </a>
              )}
            </p>
          </div>
          <div className="col-m-6 right to-center">
            <p style={{ marginRight: appStore.viewport.mobile ? '' : '3rem' }}>
              {navigation.map((nav, i) => {
                return (
                  <>
                    <Link href={nav.path}>
                      <a target={nav.newtab ? '_blank' : undefined}>
                        {nav.name}
                      </a>
                    </Link>
                    {i === navigation.length - 1 ? '' : ' · '}
                  </>
                )
              })}
            </p>
            <p style={{ marginRight: appStore.viewport.mobile ? '' : '3rem' }}>
              {gatewayStore.online || 1} 个小伙伴正在浏览
            </p>
          </div>
        </div>
      </div>
      <FooterActions />
    </footer>
  )
})

export const Footer = NoSSR(_Footer)
