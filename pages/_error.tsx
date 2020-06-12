import { useRouter } from 'next/router'
import { NextPage } from 'next'
import { sample } from 'lodash'

const errorToText = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return '抱歉啦, 页面走丢了'
    case 403:
      return '不要做一些不允许的事情啦'
    case 401:
      return '这是主人的小秘密哦, 你是我的主人吗'
    case 406:
    case 418:
      return '茶壶出现错误.'
    default:
      return '抱歉, 出了点小问题'
  }
}

const _Error: NextPage<{ statusCode: number }> = ({
  statusCode = sample([406, 418]) as number,
}) => {
  const router = useRouter()
  return (
    <div className="error">
      <div className="error_wrap">
        <h1>{statusCode}</h1>
        <div className="desc">
          <h2>{errorToText(statusCode)}</h2>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button
          className={'btn red'}
          style={{ marginRight: '12px' }}
          onClick={() => router.push('/')}
        >
          回到首页
        </button>
        <button className={'btn yellow'} onClick={() => location.reload()}>
          刷新
        </button>
      </div>
    </div>
  )
}

const getCode = (err, res) => {
  if (!err && !res) {
    return 500
  }
  if (res?.statusCode === 500 && err?.statusCode === 500) {
    return 500
  } else if (err && err.statusCode !== 500) {
    return err.statusCode
  } else if (res && res.statusCode !== 500) {
    return res.statusCode
  }
  return 500
}

_Error.getInitialProps = ({ res, err }) => {
  const statusCode = getCode(err, res)

  return { statusCode } as { statusCode: number }
}

export default _Error
