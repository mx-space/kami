// @copy https://github.com/streamich/react-use/blob/master/src/useClickAway.ts
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

function on(
  obj: EventTarget | null,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void {
  if (obj) {
    obj.addEventListener(type, listener, options)
  }
}

function off(
  obj: EventTarget | null,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions,
): void {
  if (obj) {
    obj.removeEventListener(type, listener, options)
  }
}

const defaultEvents = ['mousedown', 'touchstart']

const useClickAway = <E extends Event = Event>(
  ref: RefObject<HTMLElement | null>,
  onClickAway: (event: E) => void,
  events: string[] = defaultEvents,
) => {
  const savedCallback = useRef(onClickAway)
  useEffect(() => {
    savedCallback.current = onClickAway
  }, [onClickAway])
  useEffect(() => {
    const handler = (event: Event) => {
      const { current: el } = ref
      const target = event.target
      if (el && target && !el.contains(target as Node)) {
        savedCallback.current(event as E)
      }
    }
    for (const eventName of events) {
      on(document, eventName, handler)
    }
    return () => {
      for (const eventName of events) {
        off(document, eventName, handler)
      }
    }
  }, [events, ref])
}

export default useClickAway
