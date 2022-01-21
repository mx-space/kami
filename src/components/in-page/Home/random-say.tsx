import { useIndexViewContext } from 'pages'
import TextyAnim from 'rc-texty'
import { FC, memo, useEffect } from 'react'
import { useUpdate } from 'react-use'
import { apiClient } from 'utils'

let cacheSay = ''
export const HomeRandomSay: FC = memo(() => {
  const update = useUpdate()

  const { doAnimation } = useIndexViewContext()
  useEffect(() => {
    if (cacheSay.length > 0) {
      return
    }
    apiClient.say.getRandom().then(({ data }) => {
      if (!data) {
        return
      }
      cacheSay = `${data.text}  ——${data.author ?? data.source ?? '站长说'}`
      update()
    })

    update()
  }, [])

  return (
    <div className="overflow-hidden leading-6 text-[#aaa] my-[2rem]">
      <TextyAnim appear={doAnimation} leave={false} type={'alpha'}>
        {cacheSay}
      </TextyAnim>
    </div>
  )
})
