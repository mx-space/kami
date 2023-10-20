import { clsx } from 'clsx'
import throttle from 'lodash-es/throttle'
import {
  forwardRef,
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAudio } from 'react-use'
import { shallow } from 'zustand/shallow'

import { useMusicStore, usePlayProgress } from '~/atoms/music'
import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { RootPortal } from '~/components/ui/Portal'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { apiClient } from '~/utils/client'
import { hms } from '~/utils/time'

import styles from './index.module.css'
import { Lyrics } from './lyrics'

const METO_ENDPOINT = 'https://api.injahow.cn/meting'

type MetingPayloadType = {
  author: string
  /**
   * 歌词 url
   */
  lrc: string
  /**
   * 封面 url
   */
  pic: string
  title: string
  /**
   * 音源
   */
  url: string
}

export interface MusicPlayerRef {
  play(): void
  pause(): void
  setCursor(cursor: number): void

  next(): void
  prev(): void
  seek(time: number): void
}
export const MusicMiniPlayer = forwardRef<
  MusicPlayerRef,
  {
    playlist: number[]
    hide?: boolean
    onPlayStateChange: (state: 'play' | 'pause') => void
    onChange?: (id: number, time: number, duration: number) => void
  }
>(({ playlist, hide = false, onPlayStateChange, onChange }, ref) => {
  const len = playlist.length

  const [cur, setCur] = useState<null | (MetingPayloadType & { id: number })>(
    null,
  )

  const [cursor, setCursor] = useState(0)

  const fetchData = async (id: number, type = 'netease') => {
    if (!id) {
      return
    }
    const response = await fetch(
      `${METO_ENDPOINT}/?type=song&server=${type}&id=${id}`,
    )
    const json = (await response.json()) as MetingPayloadType[]

    let data = await apiClient.serverless.proxy.kami.song.get<any>({
      params: {
        id,
      },
    })

    data = data[0]

    const songUrl = data.url?.replace('http://', 'https://')
    setCur({ ...data, ...json[0], id, url: songUrl })
  }

  useEffect(() => {
    if (hide) return
    if (cursor >= len) {
      return
    }
    fetchData(playlist[cursor])
  }, [cursor, hide, len, playlist])

  useEffect(() => {
    setCur(null)
    setCursor(0)
  }, [playlist])

  const onChangeAudio = useCallback((e) => {
    const $audio = e.target

    if (playState.current && $audio.paused) {
      $audio.play()
    }
  }, [])

  const [audioEl, state, controls] = useAudio({
    src: cur?.url || '',
    autoPlay: false,
    loop: false,
    onEnded() {
      setCursor((cursor) => {
        const nextCursor = cursor + 1
        const afterCursor = nextCursor % len

        // if afterCursor == cursor, it means playlist only one song. so it will not loop play
        // so manually trigger play

        if (afterCursor === cursor) {
          setTimeout(() => {
            play()
          }, 100)
        }
        return afterCursor
      })
    },
    onLoadedData: onChangeAudio,
    // onDurationChange: onChangeAudio,
    onTimeUpdate(e) {
      if (onChange) {
        const $audio = e.target as HTMLAudioElement
        const duration = $audio.duration
        const currentTime = $audio.currentTime
        onChange(cur?.id || 0, currentTime, duration)
      }
    },

    onLoad: onChangeAudio,
  })
  const playState = useRef(false)
  const play = useCallback(() => {
    controls.play()
    playState.current = true
  }, [controls])

  const pause = useCallback(() => {
    controls.pause()
    playState.current = false
  }, [controls])

  useImperativeHandle(ref, () => ({
    pause,
    play,
    setCursor(cursor) {
      setCursor(cursor % len)
    },
    next() {
      setCursor((c) => ++c % len)
    },
    prev() {
      setCursor((c) => --c % len)
    },
    seek(time) {
      controls.seek(time)
    },
  }))

  useEffect(() => {
    window.player = {
      next() {
        setCursor((c) => ++c % len)
      },
    }
  }, [])

  const handleChangePlayState = useCallback(() => {
    if (state.paused) {
      play()
      onPlayStateChange('play')
    } else {
      pause()
      onPlayStateChange('pause')
    }
  }, [onPlayStateChange, pause, play, state.paused])

  const Pic = useMemo(
    () =>
      cur?.pic && (
        <div
          className={clsx(
            styles['pic'],
            'h-full w-full bg-cover bg-center bg-no-repeat',
          )}
          style={{ backgroundImage: `url(${cur.pic})` }}
        />
      ),
    [cur?.pic],
  )

  return (
    <div
      data-hide-print
      className={clsx(
        styles['player'],
        !state.paused && styles['play'],
        hide && styles['hide'],
      )}
    >
      {!hide && <Lyrics />}
      <div className={styles['root']}>
        <div className={styles['cover']}>
          {Pic}

          <div
            className={clsx(styles['control-btn'])}
            onClick={handleChangePlayState}
          >
            {state.paused ? (
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg width="1em" height="1em" viewBox="0 0 32 32">
                <path
                  d="M12 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
                  fill="currentColor"
                />
                <path
                  d="M22 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
                  fill="currentColor"
                />
              </svg>
            )}
          </div>

          {cur && audioEl}
        </div>

        {/* end cover */}

        {/* tip */}
        {cur && (
          <div
            className={styles['tip']}
            onClick={() => {
              window.open(cur.url)
            }}
          >
            <p>{cur.title}</p>
            <p className="text-gray-2 text-sm">{cur.author}</p>
            <p className="text-xs text-opacity-80">
              {hms(state.time | 0)}/{hms(state.duration | 0)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})
MusicMiniPlayer.displayName = 'MusicMiniPlayer'

const BottomProgressBar = memo(() => {
  const playProgress = usePlayProgress()

  const progress = useDeferredValue(playProgress)

  if (progress === 0) {
    return null
  }

  return (
    <RootPortal>
      <div
        className={
          'fixed bottom-0 left-0 right-0 origin-left transform-gpu transition-transform ease-linear' +
          ' bg-secondary z-99 scale-y-50 transform pt-[2px] duration-1000'
          // +' hover:pt-[8px] hover:cursor-pointer'
        }
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </RootPortal>
  )
})

BottomProgressBar.displayName = 'BottomProgressBar'
const changeOfPlayerHandler = throttle(
  (id, time, totalTime) => {
    useMusicStore.getState().setPlayInfo(id, time, totalTime)
  },
  1000,
  {
    trailing: false,
  },
)
export const _MusicMiniPlayerStoreControlled = memo(() => {
  const ref = useRef<MusicPlayerRef>(null)
  const { isPlay, isHide, playlist } = useMusicStore<{
    isPlay: boolean
    isHide: boolean
    playlist: number[]
  }>(
    (state) => ({
      isPlay: state.isPlay,
      isHide: state.isHide,
      playlist: state.list,
    }),
    shallow,
  )
  const { event } = useAnalyze()
  useEffect(() => {
    if (!ref.current) {
      console.log('player not ready')
      return
    }
    if (isPlay) {
      requestAnimationFrame(() => {
        event({
          action: TrackerAction.Interaction,
          label: `音乐播放状态：${isPlay ? '播放' : '暂停'}`,
        })
        ref.current?.play()
      })
    } else {
      ref.current.pause()
    }
  }, [isPlay])

  useEffect(() => {
    if (!isHide) {
      // auto play disable
      // ref.current?.play()
    } else {
      ref.current?.pause()
    }
  }, [isHide])

  const handleChangePlayState = useCallback((state: 'play' | 'pause') => {
    useMusicStore.setState({
      isPlay: state === 'play',
    })
  }, [])

  return (
    <>
      <MusicMiniPlayer
        ref={ref}
        onPlayStateChange={handleChangePlayState}
        playlist={playlist}
        hide={isHide}
        onChange={changeOfPlayerHandler}
      />
      <BottomProgressBar />
    </>
  )
})

_MusicMiniPlayerStoreControlled.displayName = 'MusicMiniPlayerStoreControlled'

export const MusicMiniPlayerStoreControlled = withNoSSR(
  _MusicMiniPlayerStoreControlled,
)
