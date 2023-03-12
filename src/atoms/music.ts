import { isNaN } from 'lodash-es'
import shuffle from 'lodash-es/shuffle'
import { create } from 'zustand'

import { isClientSide } from '~/utils/env'

interface MusicState {
  list: number[]
  isHide: boolean
  isPlay: boolean
  /** 正在播放的歌曲 ID */
  playId: number
  /** 当前时间 */
  time: number
  /** 持续时间 */
  duration: number
  reset(): void
  play(): void
  setPlaylist(list: number[]): void
  setHide(hide: boolean): void
  setPlay(play: boolean): void
  empty(): void
  setPlayInfo(id: number, time: number, duration: number): void

  resetPlayingSongState(): void
  resetList(): void
}

const getPlaylistId = () => {
  if (!isClientSide()) return []
  return shuffle(
    window.data?.config.function.player.id ?? [
      563534789, 1447327083, 1450252250,
    ],
  )
}

export const useMusicStore = create<MusicState>((setState, getState) => {
  const actions = getState()
  return {
    list: getPlaylistId(),
    isHide: true,
    isPlay: false,
    duration: 0,
    time: 0,
    playId: 0,
    setPlayInfo(id: number, time: number, duration: number) {
      if (isNaN(id) || isNaN(time) || isNaN(duration)) {
        return
      }
      setState({
        playId: id,
        time,
        duration,
      })
    },
    resetPlayingSongState() {
      setState({
        duration: 0,
        time: 0,
        playId: 0,
      })
    },
    reset() {
      setState({
        isHide: true,
        isPlay: false,
      })
      actions.resetList()
    },

    resetList() {
      actions.resetPlayingSongState()

      setState({
        list: getPlaylistId(),
      })
    },
    empty() {
      actions.resetPlayingSongState()
      setState({
        list: [],
        isPlay: false,
      })
    },
    setPlay(play: boolean) {
      if (getState().list.length === 0) {
        actions.resetList()
      }
      setState({
        isPlay: play,
      })
    },
    setHide(hide: boolean) {
      setState({
        isHide: hide,
      })

      if (hide) {
        setState({
          isPlay: false,
        })
      }
    },
    setPlaylist(list: number[]) {
      setState({
        list: [...list],
      })
      actions.resetPlayingSongState()
      return getState().list
    },
    play() {
      if (getState().list.length == 0) {
        actions.reset()
      }

      setState({
        isHide: false,
        isPlay: true,
      })
    },
  }
})

export const usePlayProgress = () => {
  return useMusicStore((state) => {
    const percent = state.time / state.duration

    return isNaN(percent) ? 0 : percent
  })
}
