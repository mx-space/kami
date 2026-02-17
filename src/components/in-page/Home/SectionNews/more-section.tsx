import type { FC } from 'react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import { FaSolidKissWinkHeart } from '~/components/ui/Icons/for-home'
import { LikeButton } from '~/components/ui/LikeButton'
import { NoticePanel } from '~/components/ui/Notice'
import {
  useIsEnableSubscribe,
  usePresentSubscribeModal,
} from '~/components/widgets/Subscribe/hooks'
import { useKamiConfig } from '~/hooks/app/use-initial-data'
import { apiClient } from '~/utils/client'
import { stopEventDefault } from '~/utils/dom'

import { SectionCard } from '.'
import { SectionWrap } from './section'

interface UniversalProps {
  title: string
  desc: string
  src?: string
  getRandomUnRepeatImage: () => string
}

const SubscribeCard: FC<UniversalProps> = ({
  getRandomUnRepeatImage,
  title,
  desc,
  src,
}) => {
  const t = useTranslations('home')
  const bg = useMemo(() => src || getRandomUnRepeatImage(), [src])
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal('home')

  return (
    <SectionCard
      getRandomUnRepeatImage={getRandomUnRepeatImage}
      title={title || t('subscribe')}
      desc={desc || t('subscribeDesc')}
      src={bg}
      onClick={useCallback(() => {
        if (canSubscribe) {
          present()
        } else {
          window.open('/feed')
        }
      }, [canSubscribe])}
    />
  )
}

const LikeCard = (props: UniversalProps) => {
  const { getRandomUnRepeatImage, desc, title, src } = props
  const t = useTranslations('home')
  const { data: like, mutate } = useSWR('like', () =>
    apiClient.proxy('like_this').get<number>(),
  )
  const [showLikeThisNotice, setShowLikeThisNotice] = useState(false)
  const cover = useMemo(() => src || getRandomUnRepeatImage(), [src])
  return (
    <>
      <NoticePanel
        in={showLikeThisNotice}
        onExited={useCallback(() => {
          setShowLikeThisNotice(false)
        }, [])}
        text={t('thanksLike')}
        icon={
          <div className="flex items-center">
            <LikeButton checked width="120px" />
          </div>
        }
      />
      <SectionCard
        getRandomUnRepeatImage={getRandomUnRepeatImage}
        title={`${title || t('like')} (${like ?? 0})`}
        desc={desc || t('likeDesc')}
        src={cover}
        href="/like_this"
        onClick={useCallback((e) => {
          stopEventDefault(e)
          apiClient
            .proxy('like_this')
            .post({ params: { ts: Date.now() } })
            .then(() => {
              setShowLikeThisNotice(true)
              mutate()
            })
        }, [])}
      />
    </>
  )
}

export const MoreSection: FC<{
  getRandomUnRepeatImage: () => string
  title: string
}> = memo(({ getRandomUnRepeatImage, title }) => {
  const {
    page: {
      home: { more },
    },
  } = useKamiConfig()

  return (
    <SectionWrap
      className="my-8"
      title={title}
      icon={<FaSolidKissWinkHeart />}
      showMoreIcon={false}
    >
      {more.map((item) => {
        const universalProps: UniversalProps = {
          title: item.name,
          desc: item.desc,
          src: item.cover,
          getRandomUnRepeatImage,
        }
        switch (item.type) {
          case 'like':
            return <LikeCard {...universalProps} key={item.name} />
        }
        if (item.type === 'subscribe')
          return <SubscribeCard {...universalProps} key={item.name} />
        return (
          <SectionCard {...universalProps} key={item.name} href={item.path} />
        )
      })}
    </SectionWrap>
  )
})
