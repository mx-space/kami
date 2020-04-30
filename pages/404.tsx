import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()
  return (
    <div className="error">
      <div className="error_wrap">
        <h1>404</h1>
        <div className="desc">
          <h2>页面走丢了</h2>
        </div>
      </div>
      <p>去别处看看?</p>
      <button className={'btn red'} onClick={(_) => router.push('/')}>
        回到首页
      </button>
    </div>
  )
}
