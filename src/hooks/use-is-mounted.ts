import { useEffect, useRef } from 'react'

export const useIsMounted = () => {
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  return mountedRef
}
