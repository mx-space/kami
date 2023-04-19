import Router from 'next/router'
import type { FC } from 'react'
import { memo, useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

import { FaSolidKissWinkHeart } from '@mx-space/kami-design/components/Icons'

import { LikeButton } from '~/components/universal/LikeButton'
import { NoticePanel } from '~/components/universal/Notice'
import {
  useIsEnableSubscribe,
  usePresentSubscribeModal,
} from '~/components/widgets/Subscribe/hooks'
import { apiClient } from '~/utils/client'
import { stopEventDefault } from '~/utils/dom'

import { SectionCard } from '.'
import { SectionWrap } from './section'

const SubscribeCard: FC<{
  bg: string
}> = ({ bg }) => {
  const canSubscribe = useIsEnableSubscribe()
  const { present } = usePresentSubscribeModal('home')

  return (
    <SectionCard
      title="订阅"
      desc="关注订阅不迷路哦"
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

export const MoreSection: FC<{
  getRandomUnRepeatImage: () => string
  title: string
}> = memo(({ getRandomUnRepeatImage, title }) => {
  const { data: like, mutate } = useSWR('like', () =>
    apiClient.proxy('like_this').get<number>(),
  )

  const [showLikeThisNotice, setShowLikeThisNotice] = useState(false)

  return (
    <SectionWrap
      title={title}
      icon={<FaSolidKissWinkHeart />}
      showMoreIcon={false}
      key="4"
    >
      <SectionCard
        title="留言"
        desc="你的话对我很重要"
        src={useMemo(() => getRandomUnRepeatImage(), [])}
        href="/message"
        onClick={useCallback((e) => {
          stopEventDefault(e)
          Router.push('/[page]', '/message')
        }, [])}
      />
      <SectionCard
        title="关于"
        desc="这里有我的小秘密"
        src={useMemo(() => getRandomUnRepeatImage(), [])}
        href="/about"
        onClick={useCallback((e) => {
          stopEventDefault(e)
          Router.push('/[page]', '/about')
        }, [])}
      />
      <SectionCard
        title={`点赞 (${like ?? 0})`}
        desc={'如果你喜欢的话点个赞呗'}
        src={useMemo(() => getRandomUnRepeatImage(), [])}
        href={'/like_this'}
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
      <SubscribeCard bg={useMemo(() => getRandomUnRepeatImage(), [])} />

      <NoticePanel
        in={showLikeThisNotice}
        onExited={useCallback(() => {
          setShowLikeThisNotice(false)
        }, [])}
        text="感谢喜欢！"
        icon={
          <div className="flex items-center">
            <LikeButton checked width={'120px'} />
          </div>
        }
      />
    </SectionWrap>
  )
})
