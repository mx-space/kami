import { motion } from 'framer-motion'
import type { FC } from 'react'
import { memo } from 'react'
import useSWR from 'swr'

import { TextUpTransitionView } from '~/components/ui/Transition/text-up'
import { apiClient } from '~/utils/client'

let isLoaded = false
export const HomeRandomSay: FC = memo(() => {
  const { data } = useSWR(
    'home-say',
    () =>
      apiClient.say.getRandom().then(({ data }) => {
        if (!data) {
          return
        }
        return `${data.text}  ——${data.author || data.source || '站长说'}`
      }),
    {
      fallbackData: '',
      refreshInterval: 60_000,
      revalidateOnFocus: false,
      revalidateOnMount: !isLoaded,
      onSuccess() {
        isLoaded = true
      },
    },
  )

  return (
    <motion.div
      layout
      className="my-[2rem] overflow-hidden leading-6 text-[#aaa]"
    >
      <TextUpTransitionView text={data || ''} key={data} />
    </motion.div>
  )
})
