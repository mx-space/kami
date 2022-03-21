import { useEffect, useState } from 'react'

let isSupported: boolean | undefined = undefined

export function useNativeLazyLoading() {
  const [supported, setSupported] = useState<boolean | undefined>(isSupported)

  useEffect(() => {
    if (isSupported === undefined) {
      // Cache the value so it's ready for the initial render the next time the hook is used
      isSupported = 'loading' in HTMLImageElement.prototype
    }

    setSupported(isSupported)

    if (process.env.NODE_ENV === 'test') {
      // If running in a test env, make sure to clean the value between runs
      isSupported = undefined
    }
  }, [])

  return supported
}
