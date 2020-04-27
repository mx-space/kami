import { FC } from 'react'
import ReactAplayer from 'react-aplayer'
import { observer } from 'mobx-react'
import { useStore } from 'store'
export const APlayer: FC = (props) => {
  let aPlayer: any
  const { musicStore } = useStore()
  const onPlay = () => {
    // console.log('on play')
  }

  const onPause = () => {
    // console.log('on pause')
  }

  // example of access aplayer instance
  const onInit = (ap) => {
    aPlayer = ap
    ;(window as any).aPlayer = ap
  }
  const options = {
    fixed: true,
    mini: true,
  }
  return (
    <ReactAplayer
      {...options}
      audio={musicStore.playlist}
      onInit={onInit}
      onPlay={onPlay}
      onPause={onPause}
    />
  )
}

export default observer(APlayer)
