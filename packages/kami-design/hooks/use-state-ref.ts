import { useEffect, useRef } from 'react'

export const useStateToRef = (state) => {
  const ref = useRef(state)
  useEffect(() => {
    ref.current = state
  }, [state])
  return ref
}
