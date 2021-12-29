import { FC } from 'react'
import { ErrorView } from '.'

export const NoDataErrorView: FC = (props) => {
  return (
    <ErrorView
      statusCode={408}
      showBackButton={false}
      description={
        <>
          <p>出现这个错误表示未获取到初始数据</p>
          <p>可能是 API 接口地址配置不正确, 或者后端服务出现异常</p>
        </>
      }
    />
  )
}
