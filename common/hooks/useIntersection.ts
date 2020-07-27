/*
 * @Author: Innei
 * @Date: 2020-07-27 16:03:08
 * @LastEditTime: 2020-07-27 16:03:29
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/hooks/use.ts
 * @Coding with Love
 */
import { RefObject, useEffect, useState } from 'react'

const useIntersection = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit,
): IntersectionObserverEntry | null => {
  const [
    intersectionObserverEntry,
    setIntersectionObserverEntry,
  ] = useState<IntersectionObserverEntry | null>(null)

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0])
      }

      const observer = new IntersectionObserver(handler, options)
      observer.observe(ref.current)

      return () => {
        setIntersectionObserverEntry(null)
        observer.disconnect()
      }
    }
    return () => {}
  }, [options.threshold, options.root, options.rootMargin, ref, options])

  return intersectionObserverEntry
}

export default useIntersection
