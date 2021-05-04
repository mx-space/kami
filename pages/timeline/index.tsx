import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, Fragment, memo, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { usePrevious } from 'react-use'
import { dayOfYear, daysOfYear, secondOfDay, secondOfDays } from 'utils/time'
import { QueueAnim } from '../../components/Anime'
import { SEO } from '../../components/SEO'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import { CategoryModel } from '../../models/category'
import { Rest } from '../../utils/api'
import styles from './index.module.scss'

type BaseType = {
  _id: string
  title: string
  created: string
}
interface TimeLineViewProps {
  posts: ({
    slug: string
    category: CategoryModel
    summary: string
    url: string
  } & BaseType)[]
  notes: ({
    nid: number
    weather?: string
    mood?: string
    hasMemory?: boolean
  } & BaseType)[]
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
        2021 年已过
        <CountUp
          end={percentOfYear}
          duration={PROGRESS_DURATION / 1000}
          decimals={8}
          start={prevPercentYear ?? 0}
        ></CountUp>
        %
      </p>
      <p>
        今天已过
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
  // const duration = 20
  // const getDelayTime = (year: number): number => {
  //   const prevYear = year + 1
  //   const itemsLength = sortedMap.get(prevYear)?.length

  //   if (itemsLength) {
  //     return itemsLength * 100 + getDelayTime(prevYear)
  //   } else {
  //     return 0
  //   }
  // }

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
        id: post._id,
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
        id: note._id,
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
          <article className="post-content kami-note article-list" key={year}>
            <div className="note-item">
              {/* <QueueAnim
                delay={getDelayTime(year)}
                type={'bottom'}
                duration={duration}
              > */}
              <h1 key={1}>
                {year}
                <small className={styles['count']}>({value.length})</small>
              </h1>
              {/* </QueueAnim> */}
              <ul className={styles['timeline-wrap']}>
                {value.map((item, i) => {
                  return (
                    // <QueueAnim
                    //   duration={duration}
                    //   type={'bottom'}
                    //   key={item.id}
                    //   delay={getDelayTime(year) + i * 100}
                    // >
                    // replace with `QueueAnim`
                    <div key={item.id}>
                      <li
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
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
                            style={{ marginRight: '1rem', cursor: 'pointer' }}
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

                    // </QueueAnim>
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
  const { type, year, memory } = query
  const Type = {
    post: TimelineType.Post,
    note: TimelineType.Note,
  }[type as any] as number | undefined
  const resp = (await Rest('Aggregate').get('timeline', {
    params: { type: Type, year },
  })) as any
  return {
    ...(resp?.data || {}),
    memory: !!memory,
  } as TimeLineViewProps
}
export default TimeLineView
