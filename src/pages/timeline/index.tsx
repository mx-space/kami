import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TimelineData } from '@mx-space/api-client'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, Fragment, memo, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { usePrevious } from 'react-use'
import { apiClient } from 'utils/client'
import { dayOfYear, daysOfYear, secondOfDay, secondOfDays } from 'utils/time'
import { ArticleLayout } from '../../components/layouts/ArticleLayout'
import { SEO } from '../../components/universal/Seo'
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
      <p>
        今天是 {new Date().getFullYear()} 年的第 {dayOfYear()} 天
      </p>
      <p>
        今年已过{' '}
        <CountUp
          end={percentOfYear}
          duration={PROGRESS_DURATION / 1000}
          decimals={8}
          start={prevPercentYear ?? 0}
        ></CountUp>
        %
      </p>
      <p>
        今天已过{' '}
        <CountUp
          end={percentOfDay}
          duration={PROGRESS_DURATION / 1000}
          useEasing={false}
          decimals={8}
          start={prevPercentDay ?? 0}
        ></CountUp>
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
        date: date,
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
          note.mood ? '这天的心情: ' + note.mood : undefined,
          note.weather ? '这天的天气: ' + note.weather : undefined,
          '随记',
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

  return (
    <ArticleLayout
      title={!props.memory ? '时间线' : '回忆'}
      subtitle={[
        `共有${
          arr.flat(2).filter((i) => typeof i === 'object').length
        }篇文章，${!props.memory ? '再接再厉' : '回顾一下从前吧'}`,
      ]}
      delay={500}
      key={props.memory ? 'memory' : 'timeline'}
    >
      {!props.memory && (
        <div style={{ marginTop: '-3rem', marginBottom: '3rem' }}>
          <Progress />
          <p>活在当下，珍惜眼下</p>
        </div>
      )}
      <SEO title={'时间线'} />
      {arr.reverse().map(([year, value], j) => {
        return (
          <article className="article-list" key={year}>
            <div className="note-item">
              <h1 key={1}>
                {year}
                <small className={styles['count']}>({value.length})</small>
              </h1>

              <ul className={styles['timeline-wrap']}>
                {value.map((item, i) => {
                  return (
                    <div key={item.id}>
                      <li key={item.id} className="flex items-center">
                        <Link href={item.href} as={item.as}>
                          <a>
                            <span className={'date'}>
                              {Intl.DateTimeFormat('en-us', {
                                month: '2-digit',
                                day: '2-digit',
                              }).format(item.date)}
                            </span>
                            <span className={'title'}>{item.title}</span>
                          </a>
                        </Link>
                        {item.important && (
                          <FontAwesomeIcon
                            icon={faBookmark}
                            color={'red'}
                            className="mr-4 cursor-pointer"
                            onClick={() => {
                              router.push({ query: { memory: true } })
                            }}
                          />
                        )}

                        <span className={'meta'}>
                          {item.meta.map((m, i) => (i === 0 ? m : '/' + m))}
                        </span>
                      </li>
                    </div>
                  )
                })}
              </ul>
            </div>
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
export default TimeLineView
