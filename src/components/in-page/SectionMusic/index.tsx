import clsx from 'clsx'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { memo, useDeferredValue, useEffect, useMemo } from 'react'

import { MusicIcon, PauseIcon } from '~/components/universal/Icons'
import { Seo } from '~/components/universal/Seo'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'

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
  const { musicStore } = useStore()
  const { event } = useAnalyze()
  const loadList = (id: number[]) => {
    runInAction(() => {
      event({
        action: TrackerAction.Interaction,
        label: `加载音乐播放列表，ID：${id.join(',')}`,
      })
      musicStore.setPlaylist(id)
      musicStore.isHide = false
      setTimeout(() => {
        musicStore.isPlay = true
      }, 1000)
    })
  }
  return (
    <section className={styles['kami-music']}>
      <div className={styles['music-cover']}>
        <div className={clsx(styles['fixed-cover'], styles['sticky-cover'])}>
          <img src={props.src}></img>
          <h3>{props.name}</h3>
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

const SongItem: FC<SongItemProps> = observer((props) => {
  const { index, name, time } = props
  const { musicStore } = useStore()
  const { playId } = musicStore

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
      <time className="font-mono flex-shrink-0">{time}</time>
    </li>
  )
})

const PlayingSongItem: FC<SongItemProps> = observer((props) => {
  const { index, name, time } = props
  const { musicStore } = useStore()
  const { playId, duration: totalTime, time: currentTime } = musicStore
  const { event } = useAnalyze()
  const playProgress = useDeferredValue(musicStore.playProgress)
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
      {useMemo(
        () => (
          <span className={styles['num']}>
            {musicStore.isPlay ? (
              <MusicIcon className="inline" />
            ) : (
              <PauseIcon className="inline" />
            )}
          </span>
        ),
        [musicStore.isPlay],
      )}
      <span className="flex-grow truncate">{name}</span>
      <time className="font-mono flex-shrink-0">{time}</time>
    </li>
  )
})
