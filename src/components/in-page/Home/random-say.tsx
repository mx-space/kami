import { TypeWriter } from '@innei/react-typewriter'
import { FC, memo, useEffect } from 'react'
import { useUpdate } from 'react-use'
import { apiClient } from 'utils'

let cacheSay = ''

setInterval(() => {
  cacheSay = ''
}, 60 * 1000)
export const HomeRandomSay: FC = memo(() => {
  const update = useUpdate()

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
      <TypeWriter textArray={[cacheSay]} repeat={false}>
        {cacheSay}
      </TypeWriter>
    </div>
  )
})
