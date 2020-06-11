/*
 * @Author: Innei
 * @Date: 2020-05-26 19:16:03
 * @LastEditTime: 2020-05-27 15:36:46
 * @LastEditors: Innei
 * @FilePath: /mx-web/hooks/usePrevious.ts
 * @Copyright
 */
import { useRef, useEffect } from 'react'
export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current as T
}
