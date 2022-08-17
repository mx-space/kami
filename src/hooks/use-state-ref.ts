import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

export const useStateRef = <T>(state: T): MutableRefObject<T> => {
  const ref = useRef<T>(state)
  useEffect(() => {
    ref.current = state
  }, [state])
  return ref
}
