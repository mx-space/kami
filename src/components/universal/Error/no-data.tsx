import type { FC } from 'react'

import { API_URL } from '~/constants/env'

import { ErrorView } from '.'

export const NoDataErrorView: FC = () => {
  return (
    <ErrorView
      noSeo
      statusCode={'无数据'}
      showBackButton={false}
      description={
        <>
          <p>出现这个错误表示未获取到初始数据</p>
          <p>可能是 API 接口地址配置不正确, 或者后端服务出现异常</p>
          <p>API 地址: {API_URL}</p>
        </>
      }
    />
  )
}
