import { observer } from 'mobx-react'
import { FC, useEffect } from 'react'
import ReactAplayer from 'react-aplayer'
import { useStore } from 'store'

declare var window: any

export const APlayer: FC = () => {
  const { musicStore } = useStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.aPlayer.list.clear()
      musicStore.playlist.map((i) => {
        window.aPlayer.list.add(i)
      })
      window.aPlayer.play()
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
  return <ReactAplayer {...options} onInit={onInit} />
}

export default observer(APlayer)
