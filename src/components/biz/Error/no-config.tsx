import type { FC } from 'react'

import { ErrorView } from '.'

export const NoConfigErrorView: FC = () => {
  return (
    <ErrorView
      statusCode={408}
      showBackButton={false}
      description={
        <>
          <p>出现这个错误表示未获取到配置文件</p>
          <p>可能是 API 接口地址配置不正确, 或者是配置文件不存在</p>
        </>
      }
    />
  )
}
