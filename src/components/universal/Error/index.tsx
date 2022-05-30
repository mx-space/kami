import isNumber from 'lodash-es/isNumber'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { Seo } from '~/components/universal/Seo'
import { isServerSide } from '~/utils/env'

import styles from './index.module.css'

export const errorToText = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return '抱歉啦, 页面走丢了'
    case 403:
      return '不要做一些不允许的事情啦'
    case 401:
      return '这是主人的小秘密哦, 你是我的主人吗'
    case 408:
      return isServerSide()
        ? '上游服务器连接超时'
        : '连接超时, 请检查一下网络哦!'
    case 406:
    case 418:
      return '茶壶出现错误'
    case 666:
      return '你在干什么呀'
    case 500:
    default:
      return '抱歉, 出了点小问题'
  }
}
export const ErrorView: NextPage<{
  statusCode: number | string
  showBackButton?: boolean
  showRefreshButton?: boolean
  description?: string | JSX.Element

  // 适用于无数据状态
  noSeo?: boolean
}> = ({
  statusCode = 500,
  showBackButton = true,
  showRefreshButton = true,
  description,
  noSeo = false,
}) => {
  const router = useRouter()
  const message = errorToText(isNumber(statusCode) ? statusCode : 500)
  return (
    <div className={styles['error']}>
      {!noSeo && <Seo title={message} />}
      <div>
        <h1>{statusCode}</h1>
        <div className={styles['desc']}>
          {description ?? <h2>{message}</h2>}
        </div>
      </div>
      {(showBackButton || showBackButton) && (
        <div className="mt-5">
          {showBackButton && (
            <button className={'btn red mr-3'} onClick={() => router.push('/')}>
              回到首页
            </button>
          )}
          {showRefreshButton && (
            <button className={'btn yellow'} onClick={() => router.reload()}>
              刷新
            </button>
          )}
        </div>
      )}
    </div>
  )
}
