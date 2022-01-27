import {
  faBookOpen,
  faHeart,
  faPencilAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { AggregateTop } from '@mx-space/api-client'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { useThemeConfig } from 'hooks/use-initial-data'
import { shuffle } from 'lodash-es'
import Router from 'next/router'
import { useIndexViewContext } from 'pages'
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message } from 'react-message-popup'
import { TransitionGroup } from 'react-transition-group'
import { apiClient, getRandomImage, NoSSR, stopEventDefault } from 'utils'
import styles from './section.module.css'
import SectionNews, { SectionCard, SectionNewsProps } from './SectionNews'
import { FriendsSection } from './SectionNews/friend'
import { SectionWrap } from './SectionNews/section'

const _Sections: FC<AggregateTop> = ({ notes, posts }) => {
  const config = useThemeConfig()
  const randomImages = config.site.figure?.length
    ? shuffle(config.site.figure)
    : getRandomImage()

  const currentImageIndex = useRef(0)

  const getRandomUnRepeatImage = () =>
    randomImages[currentImageIndex.current++ % randomImages.length]
  const sections = useRef({
    postSection: {
      title: '最新博文',
      icon: faBookOpen,
      moreUrl: 'posts',
      content: posts.slice(0, 4).map((p) => {
        return {
          title: p.title,
          background: getRandomUnRepeatImage(),
          id: p.id,
          ...buildRoute('Post', p),
        }
      }),
    } as SectionNewsProps,
    noteSection: {
      title: '随便写写',
      icon: faPencilAlt,
      moreUrl: 'notes',
      content: notes.slice(0, 4).map((n) => {
        return {
          title: n.title,
          background: getRandomUnRepeatImage(),
          id: n.id,
          ...buildRoute('Note', n),
        }
      }),
    } as SectionNewsProps,
  })

  const [like, setLike] = useState(0)
  useEffect(() => {
    apiClient
      .proxy('like_this')
      .get<number>()

      .then((number) => {
        setLike(~~number)
      })
  }, [])

  const { doAnimation } = useIndexViewContext()

  const SectionCompList = [
    <SectionNews {...sections.current.postSection} key="1" />,
    <SectionNews {...sections.current.noteSection} key="2" />,
    <SectionWrap
      title="朋友们"
      moreUrl="friends"
      icon={faUsers}
      key="3"
      className={'w-full'}
    >
      <FriendsSection />
    </SectionWrap>,
    <SectionWrap title="了解更多" icon={faHeart} showMoreIcon={false} key="4">
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
        title={`点赞 (${like})`}
        desc={'如果你喜欢的话点个赞呗'}
        src={useMemo(() => getRandomUnRepeatImage(), [])}
        href={'/like_this'}
        onClick={useCallback((e) => {
          stopEventDefault(e)
          apiClient
            .proxy('like_this')
            .post({ params: { ts: Date.now() } })
            .then(() => {
              message.success('感谢喜欢 ❤️')
              setLike((like) => like + 1)
            })
        }, [])}
      />
      <SectionCard
        title="订阅"
        desc="关注订阅不迷路哦"
        src={useMemo(() => getRandomUnRepeatImage(), [])}
        href="/feed"
      />
    </SectionWrap>,
  ]

  return (
    <section className={styles['root']}>
      <TransitionGroup appear={doAnimation}>
        {SectionCompList.map((s, i) => {
          return (
            <BottomUpTransitionView timeout={{ enter: 1200 + 170 * i }} key={i}>
              {s}
            </BottomUpTransitionView>
          )
        })}
      </TransitionGroup>
    </section>
  )
}

export const HomeSections = NoSSR(_Sections)

function buildRoute<T extends { id: string } & { nid?: number }>(
  type: keyof typeof ContentType,
  obj: T,
): { as: string; href: string } {
  switch (type) {
    case 'Post': {
      const { slug, category } = obj as any
      return {
        as: `/posts/${category.slug}/${slug}`,
        href: `/posts/[category]/[slug]`,
      }
    }
    case 'Note': {
      const { nid } = obj
      return {
        as: `/notes/${nid}`,
        href: `/notes/[id]`,
      }
    }
    case 'Say': {
      return { as: `/says`, href: `/says` }
    }
    // case 'Project': {
    //   const { id } = obj
    //   return { as: `/projects/${id}`, href: `/projects/[id]` }
    // }
  }
}

enum ContentType {
  Note,
  Post,
  Say,
  // Project,
}
