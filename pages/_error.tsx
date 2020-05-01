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
      <p>去别处看看?</p>
      <button className={'btn red'} onClick={(_) => router.push('/')}>
        回到首页
      </button>
    </div>
  )
}

_Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode } as { statusCode: number }
}

export default _Error
