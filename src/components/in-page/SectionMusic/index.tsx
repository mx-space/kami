import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useDeferredValue, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { useMusicStore, usePlayProgress } from '~/atoms/music'
import { Seo } from '~/components/app/Seo'
import { MusicIcon, PauseIcon } from '~/components/ui/Icons/for-fav'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'

import styles from './index.module.css'

export interface PlayListType {
  id: number
  time: string
  picUrl: string
  name: string
  author: string
  playCount?: number
}

interface SectionMusicProps {
  data: PlayListType[]
  src: string
  name: string
}

export const SectionMusic: FC<SectionMusicProps> = memo((props) => {
  const { event } = useAnalyze()
  const loadList = (id: number[]) => {
    event({
      action: TrackerAction.Interaction,
      label: `加载音乐播放列表，ID：${id.join(',')}`,
    })
    const musicStore = useMusicStore.getState()
    musicStore.setPlaylist(id)
    musicStore.setHide(false)
    setTimeout(() => {
      musicStore.setPlay(true)
    }, 1000)
  }
  return (
    <section className={styles['kami-music']}>
      <div className={styles['music-cover']}>
        <div className={clsx(styles['fixed-cover'], styles['sticky-cover'])}>
          <img src={props.src} />
          <h3 className="leading-[1.5]">{props.name}</h3>
        </div>
      </div>

      <div className={styles['music-list']}>
        <ul>
          {props.data.length ? (
            props.data.map((i, index) => {
              return (
                <SongItem
                  key={i.id}
                  index={index}
                  name={i.name}
                  time={i.time}
                  id={i.id}
                  onClick={(i) => {
                    loadList(props.data.slice(i).map((i) => i.id))
                  }}
                />
              )
            })
          ) : (
            <li>
              <span className={styles['num']}>0</span>
              这里暂时没有内容
            </li>
          )}
        </ul>
      </div>
    </section>
  )
})

type SongItemProps = {
  index: number
  time: string
  name: string
  id: number
  onClick: (index: number) => void
}

const SongItem: FC<SongItemProps> = memo((props) => {
  const { index, name, time } = props
  const playId = useMusicStore((state) => state.playId)

  if (playId === props.id) {
    return <PlayingSongItem {...props} />
  }

  return (
    <li
      onClick={() => props.onClick(index)}
      className={clsx(styles['song-item'])}
    >
      <span className={styles['num']}>{index + 1}</span>
      <span className="flex-grow truncate">{name}</span>
      <time className="flex-shrink-0 font-mono">{time}</time>
    </li>
  )
})

const PlayIcon = () => {
  const isPlay = useMusicStore((state) => state.isPlay)
  return (
    <span className={styles['num']}>
      {isPlay ? (
        <MusicIcon className="inline" />
      ) : (
        <PauseIcon className="inline" />
      )}
    </span>
  )
}

const PlayingSongItem: FC<SongItemProps> = memo((props) => {
  const { index, name, time } = props

  const {
    playId,
    duration: totalTime,
    time: currentTime,
  } = useMusicStore(
    (state) => ({
      playId: state.playId,
      duration: state.duration,
      time: state.time,
    }),
    shallow,
  )
  const { event } = useAnalyze()
  const playProgress = useDeferredValue(usePlayProgress())
  useEffect(() => {
    if (playId === 0) {
      // if playId eq 0 is init state
      return
    }
  }, [playId])

  useEffect(() => {
    event({
      action: TrackerAction.Interaction,
      label: `开始播放音乐：${playId}`,
    })
  }, [playId])
  return (
    <li
      onClick={() => props.onClick(index)}
      className={clsx(
        styles['song-item'],
        playId === props.id && totalTime && currentTime
          ? styles['playing']
          : null,
      )}
      style={{
        backgroundSize: `${playProgress * 100}% 100%`,
      }}
    >
      <Seo title={`${props.name} · 歌单`} />
      <PlayIcon />
      <span className="flex-grow truncate">{name}</span>
      <time className="flex-shrink-0 font-mono">{time}</time>
    </li>
  )
})
