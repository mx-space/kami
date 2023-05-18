import type { FC } from 'react'
import { memo } from 'react'
import useSWR from 'swr'

import { AnimateChangeInHeight } from '~/components/ui/AnimateChangeInHeight'
import { TextUpTransitionView } from '~/components/ui/Transition/TextUpTransitionView'
import { useIsClient } from '~/hooks/common/use-is-client'
import { apiClient } from '~/utils/client'

let isLoaded = false
export const HomeRandomSay: FC = memo(() => {
  const { data, mutate } = useSWR(
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
      refreshInterval: 10_000,
      revalidateOnFocus: false,
      revalidateOnMount: !isLoaded,
      onSuccess() {
        isLoaded = true
      },
    },
  )

  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <AnimateChangeInHeight className="my-[2rem]">
      <TextUpTransitionView
        onClick={() => mutate()}
        text={data || ''}
        key={data}
        className="overflow-hidden leading-6 text-[#aaa]"
      />
    </AnimateChangeInHeight>
  )
})
