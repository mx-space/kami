import classNames from 'classnames'
import { observer } from 'utils/mobx'
import { FC, useEffect } from 'react'
import ReactAplayer from 'react-aplayer'
import { useStore } from 'common/store'

declare const window: any

export const APlayer: FC = () => {
  const { musicStore } = useStore()

  useEffect(() => {
    try {
      if (musicStore.isPlay) {
        window.aPlayer.play()
      } else {
        window.aPlayer.pause()
      }
      if (musicStore.isHide) {
        window.aPlayer.pause()
      }
    } catch {
      console.error('player crashed.')
    }
  }, [musicStore.isPlay, musicStore.isHide])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.aPlayer.list.clear()
      musicStore.playlist.map((i) => {
        window.aPlayer.list.add(i)
      })
    }
  }, [musicStore.playlist])

  const onInit = (ap) => {
    window.aPlayer = ap
    if (typeof window !== 'undefined') {
      musicStore.playlist.map((i) => {
        window.aPlayer.list.add(i)
      })
    }
  }
  const options = {
    fixed: true,
    mini: true,
  }
  return (
    <div className={classNames('player', musicStore.isHide ? 'hide' : '')}>
      <style jsx>{`
        .player.hide {
          transform: translateX(-100%);
        }
        .player {
          transform: translateX(0);
          transition: transform 0.5s;
          background: transparent;
        }
      `}</style>
      <ReactAplayer {...options} onInit={onInit} />
    </div>
  )
}

export default observer(APlayer)
