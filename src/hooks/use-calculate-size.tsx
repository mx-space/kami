import { useCallback, useEffect, useReducer, useRef } from 'react'
import { calculateDimensions } from '../utils'

const initialState = { height: 0, width: 0 }
type Action = { type: 'set'; height: number; width: number } | { type: 'reset' }
export const useCalculateSize = () => {
  const [state, dispatch] = useReducer(
    (state: typeof initialState, payload: Action) => {
      switch (payload.type) {
        case 'set':
          return {
            height: payload.height,
            width: payload.width,
          }
        case 'reset':
          return initialState
        default:
          return state
      }
    },
    initialState,
  )
  const timer = useRef<any>()
  const calculateOnImageEl = useCallback(
    (parentEl: HTMLElement, imageEl: HTMLImageElement) => {
      if (!parentEl || !imageEl) {
        return
      }

      timer.current = setInterval(() => {
        const w = imageEl.naturalWidth,
          h = imageEl.naturalHeight
        if (w && h) {
          clearInterval(timer.current)
          const parentElWidth = getComputedStyle(parentEl).width

          const calculated = calculateDimensions(w, h, {
            height: Infinity,
            width: parseInt(parentElWidth),
          })

          dispatch({
            type: 'set',
            height: calculated.height,
            width: calculated.width,
          })
        }
      }, 30)
    },
    [],
  )

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return [state, calculateOnImageEl] as const
}
