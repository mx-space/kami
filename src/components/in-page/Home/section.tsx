import type { FC } from 'react'
import { useCallback, useMemo, useRef } from 'react'
import { TransitionGroup } from 'react-transition-group'

import type { AggregateTop } from '@mx-space/api-client'
import { useStateToRef } from '@mx-space/kami-design'
import { MdiDrawPen } from '@mx-space/kami-design/components/Icons/for-home'
import { IcTwotoneSignpost } from '@mx-space/kami-design/components/Icons/menu-icon'
import { BottomUpTransitionView } from '@mx-space/kami-design/components/Transition/bottom-up'

import { withNoSSR } from '~/components/biz/HoC/no-ssr'
import { useKamiConfig } from '~/hooks/use-initial-data'
import { useRandomImage } from '~/hooks/use-kami'

import type { SectionNewsProps } from './SectionNews'
import SectionNews from './SectionNews'
import { FriendsSection } from './SectionNews/friend-section'
import { MoreSection } from './SectionNews/more-section'
import { useHomePageViewContext } from './context'
import styles from './section.module.css'

const SectionsInternal: FC<AggregateTop> = ({ notes, posts }) => {
  const notesRef = useStateToRef(notes)
  const postsRef = useStateToRef(posts)

  const randomImages = useRandomImage('all')
  const currentImageIndex = useRef(0)
  const getRandomUnRepeatImage = useCallback(
    () => randomImages[currentImageIndex.current++ % randomImages.length],
    [randomImages],
  )

  const {
    page: { home: homePageConfig },
  } = useKamiConfig()
  const { sections: sectionShouldUsedList, titleMapping } = homePageConfig
  const sectionSet = useMemo(
    () => new Set(sectionShouldUsedList),
    [sectionShouldUsedList],
  )

  const sections = useMemo(() => {
    const result = {} as Record<'postSection' | 'noteSection', SectionNewsProps>
    if (sectionSet.has('post')) {
      const posts = postsRef.current
      result.postSection = {
        title: titleMapping.post || '文章',
        icon: <IcTwotoneSignpost />,
        moreUrl: 'posts',
        content: posts.slice(0, 4).map((p) => {
          return {
            title: p.title,
            background: getRandomUnRepeatImage(),
            id: p.id,
            ...buildRoute('Post', p),
          }
        }),
      }
    }
    if (sectionSet.has('note')) {
      const notes = notesRef.current
      result.noteSection = {
        title: titleMapping.note || '日记',
        icon: <MdiDrawPen />,
        moreUrl: 'notes',
        content: notes.slice(0, 4).map((n) => {
          return {
            title: n.title,
            background: getRandomUnRepeatImage(),
            id: n.id,
            ...buildRoute('Note', n),
          }
        }),
      }
    }

    return result
  }, [sectionSet, titleMapping.note, titleMapping.post])

  const { doAnimation } = useHomePageViewContext()

  const SectionCompList: (JSX.Element | null)[] = [
    sections.postSection ? (
      <SectionNews {...sections.postSection} key="1" />
    ) : null,
    sections.noteSection ? (
      <SectionNews {...sections.noteSection} key="2" />
    ) : null,

    sectionSet.has('friend') ? (
      <FriendsSection key="3" title={titleMapping.friend || '朋友们'} />
    ) : null,
    sectionSet.has('more') ? (
      <MoreSection
        getRandomUnRepeatImage={getRandomUnRepeatImage}
        title={titleMapping.more || '了解更多'}
      />
    ) : null,
  ]

  return (
    <section className={styles['root']}>
      <TransitionGroup appear={doAnimation}>
        {SectionCompList.map((s, i) => {
          return (
            <BottomUpTransitionView timeout={{ enter: 1200 + 200 * i }} key={i}>
              {s}
            </BottomUpTransitionView>
          )
        })}
      </TransitionGroup>
    </section>
  )
}

export const HomeSections = withNoSSR(SectionsInternal)

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
