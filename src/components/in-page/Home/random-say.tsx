import type { FC } from 'react'
import { memo, useEffect } from 'react'
import { useUpdate } from 'react-use'
import { apiClient } from 'utils'

import { TextFade } from '~/components/universal/Animate/text-anim'

let cacheSay = ''

export const HomeRandomSay: FC = memo(() => {
  const update = useUpdate()

  useEffect(() => {
    const timer = setInterval(() => {
      cacheSay = ''
    }, 60 * 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

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
      <TextFade text={cacheSay} />
    </div>
  )
})
