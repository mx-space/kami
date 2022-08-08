import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAutoAnimate } from '@formkit/auto-animate/react'

import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
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
    'opacity-0',
    'text-gray-1 !scale-125',
    'filter blur-[2px]',
    'filter blur-[4px]',
  ]).current

  return (
    <div className="absolute top-0 left-0 max-w-[40vw] min-w-[calc(100%+200px)] tablet:hidden">
      <div className="absolute bottom-2">
        <ul
          ref={animationParent}
          className="text-gray-1 pl-2 !hover:children:text-shizuku-text !hover:children:filter-none"
        >
          {list.map((item, index) => {
            return (
              <li
                key={item.hms}
                data-hms={item.hms}
                className={clsx(
                  'my-2 transform origin-left transition-all opacity-100 scale-100 !duration-500 ease-in-out',
                  classNameMap[index],
                )}
              >
                <BottomUpTransitionView
                  key={item.hms}
                  timeout={{ enter: index * 50 }}
                >
                  <p>{item.content}</p>
                </BottomUpTransitionView>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
