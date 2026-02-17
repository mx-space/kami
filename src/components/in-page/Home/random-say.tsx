import type { FC } from 'react'
import { memo } from 'react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import { AnimateChangeInHeight } from '~/components/ui/AnimateChangeInHeight'
import { TextUpTransitionView } from '~/components/ui/Transition/TextUpTransitionView'
import { useIsClient } from '~/hooks/common/use-is-client'
import { apiClient } from '~/utils/client'

let isLoaded = false
export const HomeRandomSay: FC = memo(() => {
  const t = useTranslations('home')
  const { data: sayData, mutate } = useSWR(
    'home-say',
    () =>
      apiClient.say.getRandom().then(({ data }) => {
        if (!data) return undefined
        return { text: data.text, author: data.author, source: data.source }
      }),
    {
      fallbackData: undefined as
        | { text: string; author: string | undefined; source: string | undefined }
        | undefined,
      refreshInterval: 10_000,
      revalidateOnFocus: false,
      revalidateOnMount: !isLoaded,
      onSuccess() {
        isLoaded = true
      },
    },
  )

  const isClient = useIsClient()
  const displayText =
    sayData &&
    `${sayData.text}  ——${sayData.author || sayData.source || t('randomSayBy')}`

  if (!isClient) return null

  return (
    <AnimateChangeInHeight className="my-[2rem]">
      <TextUpTransitionView
        onClick={() => mutate()}
        text={displayText || ''}
        key={displayText || 'empty'}
        className="overflow-hidden leading-6 text-[#aaa]"
      />
    </AnimateChangeInHeight>
  )
})
