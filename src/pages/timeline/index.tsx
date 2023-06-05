import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { Fragment, memo, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { usePrevious } from 'react-use'

import type { TimelineData } from '@mx-space/api-client'

import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { TimelineListWrapper } from '~/components/in-page/Timeline/TimelineListWrapper'
import { SolidBookmark } from '~/components/ui/Icons/for-note'
import { NumberTransition } from '~/components/ui/NumberRecorder'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'
import { apiClient } from '~/utils/client'
import { springScrollToElement } from '~/utils/spring'
import { dayOfYear, daysOfYear, secondOfDay, secondOfDays } from '~/utils/time'

import { Seo } from '../../components/app/Seo'
import { ArticleLayout } from '../../components/layouts/ArticleLayout'
import styles from './index.module.css'

interface TimeLineViewProps extends TimelineData {
  memory: boolean
}
enum ArticleType {
  Post,
  Note,
}
type MapType = {
  title: string
  meta: string[]
  date: Date
  href: string
  as: string
  type: ArticleType
  id: string
  important?: boolean
}

const PROGRESS_DURATION = 2000
const Progress: FC = memo(() => {
  const [percentOfYear, setPercentYear] = useState<number>(0)
  const [percentOfDay, setPercentDay] = useState<number>(0)
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  )
  const [currentDay, setCurrentDay] = useState<number>(dayOfYear())

  useEffect(() => {
    const timer = setInterval(() => {
      const year = new Date().getFullYear()
      const day = dayOfYear()
      setCurrentDay(day)
      setCurrentYear(year)
    }, PROGRESS_DURATION)
    return () => clearInterval(timer)
  }, [])

  const prevPercentYear = usePrevious(percentOfYear)
  const prevPercentDay = usePrevious(percentOfDay)
  function updatePercent() {
    const nowY = (dayOfYear() / daysOfYear(new Date().getFullYear())) * 100
    const nowD = (secondOfDay() / secondOfDays) * 100
    if (nowY !== percentOfYear) {
      setPercentYear(nowY)
    }
    setPercentDay(nowD)
  }
  useEffect(() => {
    updatePercent()
    let timer = setInterval(updatePercent, PROGRESS_DURATION)
    return () => {
      // @ts-ignore
      timer = clearInterval(timer)
    }
  }, [])
  return (
    <Fragment>
      <p className="mt-4 inline-flex items-center">
        <span className="flex-shrink-0">今天是 {currentYear} 年的第</span>
        <NumberTransition number={currentDay} className="mx-1" />
        <span className="flex-shrink-0">天</span>
      </p>
      <p className="my-4">
        今年已过{' '}
        <CountUp
          end={percentOfYear}
          duration={PROGRESS_DURATION / 1000}
          decimals={8}
          start={prevPercentYear ?? 0}
        />
        %
      </p>
      <p className="my-4">
        今天已过{' '}
        <CountUp
          end={percentOfDay}
          duration={PROGRESS_DURATION / 1000}
          useEasing={false}
          decimals={8}
          start={prevPercentDay ?? 0}
        />
        %
      </p>
    </Fragment>
  )
})

const TimeLineView: NextPage<TimeLineViewProps> = (props) => {
  const sortedMap = new Map<number, MapType[]>()

  const { posts = [], notes = [] } = props

  if (!props.memory) {
    posts.forEach((post) => {
      const date = new Date(post.created)
      const year = date.getFullYear()
      const data: MapType = {
        title: post.title,
        meta: [post.category.name, '博文'],
        date,
        as: `/posts/${post.category.slug}/${post.slug}`,
        href: `/posts/[category]/[slug]`,
        type: ArticleType.Post,
        id: post.id,
      }
      sortedMap.set(
        year,
        sortedMap.get(year) ? sortedMap.get(year)!.concat(data) : [data],
      )
    })
  }

  notes
    .filter((n) => (props.memory ? n.hasMemory : true))
    .forEach((note) => {
      const date = new Date(note.created)
      const year = date.getFullYear()
      const data: MapType = {
        title: note.title,
        meta: [
          note.mood ? `心情：${note.mood}` : undefined,
          note.weather ? `天气：${note.weather}` : undefined,
          '手记',
        ].filter(Boolean) as string[],
        date,
        as: `/notes/${note.nid}`,
        href: '/notes/[id]',
        type: ArticleType.Note,
        id: note.id,
        important: note.hasMemory,
      }

      sortedMap.set(
        year,
        sortedMap.get(year) ? sortedMap.get(year)!.concat(data) : [data],
      )
    })

  sortedMap.forEach((val, key) => {
    sortedMap.set(
      key,
      val.sort((a, b) => b.date.getTime() - a.date.getTime()),
    )
  })

  const arr = Array.from(sortedMap)
  const router = useRouter()

  const { event } = useAnalyze()

  useEffect(() => {
    if (props.memory) {
      event({
        action: TrackerAction.Impression,
        label: '时间线 - 回忆',
      })
    }
  }, [props.memory])

  useEffect(() => {
    setTimeout(() => {
      const jumpToId = new URLSearchParams(location.search).get('id')
      if (jumpToId) {
        const target = document.querySelector(
          `[data-id="${jumpToId}"]`,
        ) as HTMLElement

        if (target) {
          springScrollToElement(target, -500)
          target.animate(
            [
              {
                backgroundColor: 'var(--secondary)',
              },
              {
                backgroundColor: 'transparent',
              },
            ],
            {
              duration: 1500,
              easing: 'ease-in-out',
              fill: 'both',
              iterations: 1,
            },
          )
        }
      }
      // wait for user focus
    }, 100)
  }, [])
  const isMobile = useDetectPadOrMobile()

  return (
    <ArticleLayout
      title={!props.memory ? '时间线' : '回忆'}
      subtitle={[
        `共有 ${
          arr.flat(2).filter((i) => typeof i === 'object').length
        } 篇文章，${!props.memory ? '再接再厉' : '回顾一下从前吧'}`,
      ]}
      delay={500}
      key={props.memory ? 'memory' : 'timeline'}
    >
      {!props.memory && (
        <div className="text-shizuku-text -mt-12 mb-12">
          <Progress />
          <p>活在当下，珍惜眼下</p>
        </div>
      )}
      <Seo title="时间线" />
      {arr.reverse().map(([year, value]) => {
        return (
          <article className="article-list" key={year}>
            <h1 key={1} className="!-ml-3">
              {year}
              <small className={styles['count']}>({value.length})</small>
            </h1>
            <TimelineListWrapper>
              {value.map((item) => {
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                    data-id={item.id}
                  >
                    <span className="flex min-w-0 flex-shrink items-center">
                      <span className="text-shizuku-text mr-2 inline-block w-12 tabular-nums">
                        {Intl.DateTimeFormat('en-us', {
                          month: '2-digit',
                          day: '2-digit',
                        }).format(item.date)}
                      </span>
                      <Link
                        target="_blank"
                        href={item.href}
                        as={item.as}
                        className="min-w-0 truncate leading-6"
                      >
                        <span className="kami-timeline__title min-w-0 truncate">
                          {item.title}
                        </span>
                      </Link>
                      {item.important && (
                        <SolidBookmark
                          className="text-red mr-4 cursor-pointer"
                          onClick={() => {
                            router.push({ query: { memory: true } })
                          }}
                        />
                      )}
                    </span>
                    {!isMobile && (
                      <span className="kami-timeline__meta meta">
                        {item.meta.map((m, i) => (i === 0 ? m : `/${m}`))}
                      </span>
                    )}
                  </li>
                )
              })}
            </TimelineListWrapper>
          </article>
        )
      })}
    </ArticleLayout>
  )
}

enum TimelineType {
  Post,
  Note,
}
TimeLineView.getInitialProps = async (ctx) => {
  const query = ctx.query
  const { type, year, memory } = query as any
  const Type = {
    post: TimelineType.Post,
    note: TimelineType.Note,
  }[type as any] as number | undefined
  const payload = await apiClient.aggregate.getTimeline({
    type: Type,
    year,
  })
  return {
    ...payload.data,
    memory: !!memory,
  } as TimeLineViewProps
}
export default wrapperNextPage(TimeLineView)
