import { useRouter } from 'next/router'
import { NextPage } from 'next'

const _Error: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  const router = useRouter()
  return (
    <div className="error">
      <div className="error_wrap">
        <h1>{statusCode}</h1>
        <div className="desc">
          {statusCode === 404 ? (
            <h2>页面走丢了</h2>
          ) : (
            <h2>抱歉, 出了点小问题</h2>
          )}
        </div>
      </div>
      <p>去别处看看? | 刷新试试? </p>
      <button className={'btn red'} onClick={() => router.push('/')}>
        回到首页
      </button>
    </div>
  )
}

const getCode = (err, res) => {
  if (!err && !res) {
    return 500
  }
  if (res?.statusCode === 500 && err?.statusCode === 500) {
    return 500
  } else if (err && err?.statusCode !== 500) {
    return err.statusCode
  } else if (res && res?.statusCode !== 500) {
    return res.statusCode
  }
  return 500
}

_Error.getInitialProps = ({ res, err }) => {
  const statusCode = getCode(err, res)

  return { statusCode } as { statusCode: number }
}

export default _Error
