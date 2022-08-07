import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'

import { store } from '~/store'

import type { LyricsContent } from './lyrics.clsss'
import { LyricsManager } from './lyrics.clsss'
import { useFetchLyrics } from './use-fetch'

export const Lyrics: FC = observer(() => {
  const playId = store.musicStore.playId

  const lyrics = useFetchLyrics(playId)

  return lyrics ? <LyricsRender lyrics={lyrics} /> : null
})

const LyricsRender: FC<{ lyrics: string }> = observer(({ lyrics }) => {
  const lyricsInstance = useMemo(() => new LyricsManager(lyrics), [lyrics])

  const currentTime = store.musicStore.time * 1000

  const [list, setList] = useState([] as LyricsContent[])

  useEffect(() => {
    const result = lyricsInstance.getCurrentTimeline(currentTime)

    setList((prev) => {
      if (prev[0]?.hms === result[0]?.hms) {
        return prev
      } else {
        return result
      }
    })
  }, [currentTime])

  const [animationParent] = useAutoAnimate<HTMLUListElement>()
  const classNameMap = useRef([
    'text-gray-1',
    'filter blur-[2px]',
    'filter blur-[4px]',
  ]).current

  return (
    <div className="absolute top-0 left-0 max-w-[40vw] min-w-[calc(100%+200px)] tablet:hidden">
      <div className="absolute bottom-2">
        <ul
          ref={animationParent}
          className="text-gray-1 pl-2 !hover:children:text-shizuku-text !hover:children:filter-none children:transition-all duration-500"
        >
          {list.map((item, index) => {
            return (
              <li
                key={item.hms}
                data-hms={item.hms}
                className={clsx(classNameMap[index], 'my-2')}
              >
                <p>{item.content}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
