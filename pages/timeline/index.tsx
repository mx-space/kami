import { NextPage } from 'next'
import { Rest } from '../../utils/api'
import { CategoryModel } from '../../models/dto/category'
import { Weather, Mood } from '../../models/dto/note'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    weather?: Weather
    mood?: Mood
  } & BaseType)[]
}
enum ArticleType {
  Post,
  Note,
}
type mapType = {
  title: string
  meta: string[]
  date: Date
  href: string
  as: string
  type: ArticleType
}
const TimeLineView: NextPage<TimeLineViewProps> = (props) => {
  const sortedMap = new Map<number, mapType[]>()
  const [map, setMap] = useState<typeof sortedMap>(new Map())
  const { posts, notes } = props
  posts /* .reverse() */
    .forEach((post) => {
      const date = new Date(post.created)
      const year = date.getFullYear()
      const data: mapType = {
        title: post.title,
        meta: [post.category.name, '博文'],
        date: date,
        as: `/posts/${post.category.slug}/${post.slug}`,
        href: `/posts/[category]/[slug]`,
        type: ArticleType.Post,
      }
      sortedMap.set(
        year,
        sortedMap.get(year) ? sortedMap.get(year)!.concat(data) : [data],
      )
    })

  notes /* .reverse() */
    .forEach((note) => {
      const date = new Date(note.created)
      const year = date.getFullYear()
      const data: mapType = {
        title: note.title,
        meta: [
          '这天的心情: ' + (note.mood || '一般'),
          note.weather ? '这天的天气: ' + note.weather : undefined,
          '随记',
        ].filter((_) => _) as string[],
        date,
        as: `/notes/${note.nid}`,
        href: '/notes/[id]',
        type: ArticleType.Note,
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
  useEffect(() => {
    if (!map.size) {
      setMap(sortedMap)
    }
  }, [map])
  return (
    <main className={'is-article'}>
      <section className={'post-title'}>
        <h1>时间线</h1>

        <h2>共有{posts.length + notes.length}篇文章, 再接再厉</h2>
      </section>
      {Array.from(map)
        .reverse()
        .map(([year, value]) => {
          return (
            <article className="post-content paul-note" key={year}>
              <style jsx>
                {`
                  h1 {
                    margin: 10px 0 15px;
                    font-size: 1.5rem;
                    font-family: Helvetica;
                  }
                  ul {
                    padding-left: 0.5em;
                    list-style: circle;
                    margin: 10px 0;
                    line-height: 30px;
                  }

                  a {
                    text-decoration: none;
                    color: var(--shizuku-text-color);
                    border-bottom: 1px solid rgba(0, 0, 0, 0);
                    margin-right: 1em;
                    transition: border 0.15s ease-out;
                  }
                  a:hover {
                    border-color: var(--shizuku-text-color);
                  }
                  .date {
                    margin-right: 0.5em;
                  }
                `}
              </style>
              <div className="note-item">
                <h1>{year}</h1>

                <ul>
                  {value.map((item, i) => {
                    return (
                      <li key={i}>
                        <Link href={item.href} as={item.as}>
                          <a>
                            <span className={'date'}>
                              {(item.date.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}
                              /{item.date.getDate().toString().padStart(2, '0')}
                            </span>
                            <span className={'title'}>{item.title}</span>
                          </a>
                        </Link>

                        <span className={'meta'}>
                          {item.meta.map((m, i) => (i === 0 ? m : '/' + m))}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </article>
          )
        })}
    </main>
  )
}

TimeLineView.getInitialProps = async () => {
  const resp = (await Rest('Aggregate').get('timeline')) as any
  return { ...(resp?.data || {}) } as TimeLineViewProps
}
export default TimeLineView
