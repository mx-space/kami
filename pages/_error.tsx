import { useRouter } from 'next/router'

function _Error({ statusCode }) {
  const router = useRouter()
  return (
    <div className="error">
      <div className="error_wrap">
        <h1>{statusCode}</h1>
        <div className="desc">
          <h2>抱歉, 出了点小问题</h2>
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
  return { statusCode }
}

export default _Error
