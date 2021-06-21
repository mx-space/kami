/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-06-21 23:18:20
 * @LastEditors: Innei
 * @FilePath: /web/components/Footer/index.tsx
 * Mark: Coding with Love
 */
import { faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useInitialData } from 'common/context/InitialDataContext'
import Link from 'next/link'
import React, { FC, Fragment } from 'react'
import { NoSSR } from 'utils'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'
import configs from '../../configs'
import { FooterActions } from './actions'

declare const window: any

const _Footer: FC = observer(() => {
  const { appStore, gatewayStore } = useStore()
  const thisYear = new Date().getFullYear()
  const initialData = useInitialData()
  const name = initialData.user.name
  return (
    <footer>
      <div className="wrap">
        <div className={'row'} style={{ paddingBottom: '18px' }}>
          <div className="col-m-6 left to-center">
            <p>
              © {thisYear !== 2020 && '2020-'}
              {thisYear}{' '}
              <a href={configs.homePage ?? '#'} target="_blank">
                {name}
              </a>
              .{' '}
              <span title={'Stay hungry. Stay foolish. -- Steve Jobs'}>
                Stay hungry. Stay foolish.
              </span>
            </p>
            <p>
              Powered by <FontAwesomeIcon icon={faReact} />
              <a
                href="https://github.com/mx-space"
                title={window.version && '开发版本: ' + window.version}
              >
                {' mx-space '}
              </a>
              <FontAwesomeIcon icon={faNodeJs} />.{' '}
              {!!configs.icp && !!configs.icp.name && !!configs.icp.url && (
                <a href={configs.icp.url} target={'_blank'} rel={'noreferrer'}>
                  {configs.icp.name}
                </a>
              )}
            </p>
          </div>
          <div className="col-m-6 right to-center">
            <p style={{ marginRight: appStore.viewport.mobile ? '' : '3rem' }}>
              <Link href="/[page]" as="/about">
                <a>关于</a>
              </Link>
              ·
              <Link href="/[page]" as="/message">
                <a>留言</a>
              </Link>
              ·
              <Link href="/friends">
                <a>友链</a>
              </Link>
              ·
              <a href="/feed" target="_blank">
                RSS 订阅
              </a>
              ·
              <a href="/sitemap.xml" target={'_blank'}>
                站点地图
              </a>
              {configs.travellings && (
                <Fragment>
                  ·
                  <a href="//travellings.link" target={'_blank'}>
                    开往
                  </a>
                </Fragment>
              )}
            </p>
            <p style={{ marginRight: appStore.viewport.mobile ? '' : '3rem' }}>
              {gatewayStore.online} 个小伙伴正在浏览
            </p>
          </div>
        </div>
      </div>
      <FooterActions />
    </footer>
  )
})
/// FIXME: 2021-05-04 12:08:05 好像也开始丢 CSS 了
export const Footer = NoSSR(_Footer)
