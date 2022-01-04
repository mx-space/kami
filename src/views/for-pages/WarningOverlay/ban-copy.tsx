import { userStore } from 'common/store'
import { OverLay } from 'components/Overlay'
import { FC, useEffect, useRef, useState } from 'react'
import { observer } from 'utils'

export const BanCopy: FC = observer((props) => {
  const isLogged = userStore.isLogged
  const [showCopyWarn, setShowCopyWarn] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const $el = ref.current
    $el.oncopy = (e) => {
      if (userStore.isLogged) {
        return
      }
      e.preventDefault()
      setShowCopyWarn(true)
    }

    return () => {
      $el.oncopy = null
    }
  }, [isLogged])
  return (
    <>
      <div ref={ref}>{props.children}</div>
      <OverLay
        onClose={() => {
          setShowCopyWarn(false)
        }}
        show={showCopyWarn}
        center
        darkness={0.8}
      >
        <h1 className={'mt-0 text-red pointer-events-none'}>注意: </h1>
        <div className="mb-0 text-white text-opacity-80 pointer-events-none">
          <p>本文章为站长原创, 保留版权所有, 禁止复制.</p>
        </div>
      </OverLay>
    </>
  )
})
