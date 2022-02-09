import { OverLay } from 'components/universal/Overlay'
import { MaidianAction } from 'constants/maidian'
import { useGtag } from 'hooks/use-gtag'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useRef, useState } from 'react'
import { useStore } from 'store'

export const BanCopy: FC = observer((props) => {
  const { userStore } = useStore()
  const isLogged = userStore.isLogged
  const [showCopyWarn, setShowCopyWarn] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { event } = useGtag()
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
      event({ action: MaidianAction.BanCopy })
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
      >
        <h1 className={'mt-0 text-red pointer-events-none'}>注意: </h1>
        <div className="my-3 text-white text-opacity-80 pointer-events-none">
          <p>本文章为站长原创, 保留版权所有, 禁止复制.</p>
        </div>
      </OverLay>
    </>
  )
})
