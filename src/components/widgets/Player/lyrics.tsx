import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

import { getTransitionSizes } from '@formkit/auto-animate'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { useMusicStore } from '~/atoms/music'
import { withDesktopOnly } from '~/components/app/HoC/viewport'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'

import type { LyricsContent } from './lyrics-manager'
import { LyricsManager } from './lyrics-manager'
import { useFetchLyrics } from './use-fetch'

export const Lyrics: FC = withDesktopOnly(() => {
  const playId = useMusicStore((state) => state.playId)
  const lyrics = useFetchLyrics(playId)

  return lyrics ? <LyricsRender lyrics={lyrics} /> : null
})

const LyricsRender: FC<{ lyrics: string }> = memo(({ lyrics }) => {
  const lyricsInstance = useMemo(() => new LyricsManager(lyrics), [lyrics])

  const currentTime = useMusicStore((state) => state.time * 1000)

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

  const [animationParent] = useAutoAnimate<HTMLUListElement>(
    (el, action, oldCoords, newCoords) => {
      let keyframes: Keyframe[] = []
      // supply a different set of keyframes for each action
      if (action === 'add') {
        keyframes = []
      }
      // keyframes can have as many "steps" as you prefer
      // and you can use the 'offset' key to tune the timing
      if (action === 'remove') {
        keyframes = [
          { opacity: 1 },
          { opacity: 1, offset: 0.33 },
          { opacity: 0.5, offset: 0.5 },
          { opacity: 0, offset: 1 },
        ]
      }
      if (action === 'remain') {
        if (!oldCoords || !newCoords) {
          return new KeyframeEffect(el, keyframes, {})
        }
        // for items that remain, calculate the delta
        // from their old position to their new position
        const deltaX = oldCoords.left - newCoords.left
        const deltaY = oldCoords.top - newCoords.top
        // use the getTransitionSizes() helper function to
        // get the old and new widths of the elements
        const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(
          el,
          oldCoords,
          newCoords,
        )
        // set up our steps with our positioning keyframes
        const start: Keyframe = {
          transform: `translate(${deltaX}px, ${deltaY}px)`,
        }

        const end: Keyframe = { transform: `translate(0, 0)` }
        // if the dimensions changed, animate them too.
        if (widthFrom !== widthTo) {
          start.width = `${widthFrom}px`

          end.width = `${widthTo}px`
        }
        if (heightFrom !== heightTo) {
          start.height = `${heightFrom}px`

          end.height = `${heightTo}px`
        }
        keyframes = [start, end]
      }
      // return our KeyframeEffect() and pass
      // it the chosen keyframes.
      return new KeyframeEffect(el, keyframes, {
        duration: 600,
        easing: 'ease-out',
      })
    },
  )
  const classNameMap = useRef([
    '!opacity-0 pointer-events-none',
    'text-gray-1',
    'filter blur-[2px]',
    'filter blur-[4px]',
  ]).current

  return (
    <div className="tablet:hidden absolute left-0 top-0">
      <div className="absolute bottom-2">
        <ul
          ref={animationParent}
          className="text-gray-1 !hover:children:text-shizuku-text !hover:children:filter-none max-w-[250px] pl-2"
        >
          {list.map((item, index) => {
            return (
              <li
                key={item.content}
                data-hms={item.hms}
                className={clsx(
                  'my-2 origin-left scale-100 transform opacity-100 transition-all !duration-500 ease-in-out',
                  classNameMap[index],
                )}
              >
                <BottomToUpTransitionView
                  key={item.hms}
                  timeout={{ enter: 300 }}
                >
                  <p className="truncate">
                    {item.content}
                    <span className="invisible select-none">.</span>
                  </p>
                </BottomToUpTransitionView>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
})
