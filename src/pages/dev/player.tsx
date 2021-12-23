import {
  MusicMiniPlayerStoreControlled,
  MusicPlayerRef,
} from 'components/Player'
import React, { useEffect, useRef } from 'react'

export default function Player() {
  const ref = useRef<MusicPlayerRef>(null)
  useEffect(() => {
    ;(window as any).a = ref.current
  }, [])
  return (
    <div className="">
      {/* <div
        className="h-full absolute bg-gray top-0"
        style={{ left: '300px', width: '1px' }}
      ></div> */}
      {/* <div className="h-screen" style={{ transform: 'translateX(300px)' }}> */}
      {/* <MusicMiniPlayer
        playlist={[563534789, 1447327083, 1450252250]}
        ref={ref}
      /> */}
      <MusicMiniPlayerStoreControlled />
      {/* </div> */}
    </div>
  )
}
