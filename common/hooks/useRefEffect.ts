// @ts-nocheck
import { useDebugValue, useEffect, useState } from 'react'

// internalRef is used as a reference and therefore save to be used inside an effect
/* eslint-disable react-hooks/exhaustive-deps */

// the `process.env.NODE_ENV !== 'production'` condition is resolved by the build tool
/* eslint-disable react-hooks/rules-of-hooks */

const noop: (...args: any[]) => any = () => {}

/**
 * `useRefEffect` returns a mutable ref object to be connected with a DOM Node.
 *
 * The returned object will persist for the full lifetime of the component.
 * Accepts a function that contains imperative, possibly effectful code.
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 */
export const useRefEffect = <T extends unknown>(
  effect: (element: T) => void | (() => void),
  dependencies?: any[],
): React.RefCallback<T> & React.MutableRefObject<T | null> => {
  // Use the initial state as mutable reference
  const internalRef = useState(() => {
    let currentValue = null as T | null
    let cleanupPreviousEffect = noop as () => void
    let currentDeps: any[] | undefined = undefined
    /**
     * React.RefCallback
     */
    function setRefValue(newElement: T | null) {
      if (internalRef.deps !== currentDeps || currentValue !== newElement) {
        currentValue = newElement
        currentDeps = internalRef.deps
        internalRef.cleanup()
        if (newElement) {
          cleanupPreviousEffect = internalRef.run(newElement) || noop
        }
      }
    }
    return {
      run: effect,
      cleanup: () => {
        cleanupPreviousEffect()
        cleanupPreviousEffect = noop
      },
      deps: dependencies,
      ref: Object.defineProperty(setRefValue, 'current', {
        get: () => currentValue,
        set: setRefValue,
      }),
    }
  })[0]

  // Show the current ref value in development
  // in react dev tools
  if (process.env.NODE_ENV !== 'production') {
    useDebugValue(internalRef.ref.current)
  }

  // Keep a ref to the latest callback
  internalRef.run = effect
  // Keep a ref to the latest dependencies
  internalRef.deps = dependencies

  // Run effect if dependencies change
  useEffect(() => {
    internalRef.ref(internalRef.ref.current)
    return () => {
      if (internalRef.deps === dependencies) {
        internalRef.cleanup()
      }
    }
  }, dependencies || [])

  return internalRef.ref
}
