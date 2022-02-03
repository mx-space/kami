import { useEffect } from 'react'

type NonEmptyArray<T> = [T, ...T[]]

export type ModifierKey = NonEmptyArray<
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Hyper'
  | 'Meta'
  | 'Shift'
  | 'Super'
>

export function useHotKey(
  options: { key: string; modifier?: ModifierKey; preventInput?: boolean },
  callback: () => void,
) {
  const { key, modifier, preventInput = true } = options
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (preventInput) {
        const $activeElement = document.activeElement as HTMLElement

        if (
          $activeElement &&
          (['input', 'textarea'].includes(
            $activeElement.tagName.toLowerCase(),
          ) ||
            $activeElement.getAttribute('contenteditable') === 'true')
        ) {
          return
        }
      }
      if (event.key === key) {
        if (modifier) {
          modifier.every((mod) => event.getModifierState(mod)) && callback()
        } else {
          event.preventDefault()
          callback()
        }
      }
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback])
}
