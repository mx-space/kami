import type { Dispatch, MutableRefObject, SetStateAction } from 'react'

export const useSafeSetState = <S>(
  setState: Dispatch<SetStateAction<S>>,
  mountedRef: MutableRefObject<boolean>,
) => {
  const setSafeState = (state: S) => {
    if (mountedRef.current) {
      setState(state)
    }
  }
  return setSafeState
}
