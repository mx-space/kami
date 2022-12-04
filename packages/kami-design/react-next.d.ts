// copy from @types/react@18
// why not use @types/react@18 directly, buz it is fucking shit break all change.
import 'react'

declare module 'react' {
  // must be synchronous
  export type TransitionFunction = () => VoidOrUndefinedOnly
  // strange definition to allow vscode to show documentation on the invocation
  export interface TransitionStartFunction {
    /**
     * State updates caused inside the callback are allowed to be deferred.
     *
     * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**
     *
     * @param callback A _synchronous_ function which causes state updates that can be deferred.
     */
    (callback: TransitionFunction): void
  }

  /**
   * Returns a deferred version of the value that may “lag behind” it for at most `timeoutMs`.
   *
   * This is commonly used to keep the interface responsive when you have something that renders immediately
   * based on user input and something that needs to wait for a data fetch.
   *
   * A good example of this is a text input.
   *
   * @param value The value that is going to be deferred
   *
   * @see https://reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue
   */
  export function useDeferredValue<T>(value: T): T

  /**
   * Allows components to avoid undesirable loading states by waiting for content to load
   * before transitioning to the next screen. It also allows components to defer slower,
   * data fetching updates until subsequent renders so that more crucial updates can be
   * rendered immediately.
   *
   * The `useTransition` hook returns two values in an array.
   *
   * The first is a boolean, React’s way of informing us whether we’re waiting for the transition to finish.
   * The second is a function that takes a callback. We can use it to tell React which state we want to defer.
   *
   * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**
   *
   * @param config An optional object with `timeoutMs`
   *
   * @see https://reactjs.org/docs/concurrent-mode-reference.html#usetransition
   */
  export function useTransition(): [boolean, TransitionStartFunction]

  /**
   * Similar to `useTransition` but allows uses where hooks are not available.
   *
   * @param callback A _synchronous_ function which causes state updates that can be deferred.
   */
  export function startTransition(scope: TransitionFunction): void

  export function useId(): string

  /**
   * @param effect Imperative function that can return a cleanup function
   * @param deps If present, effect will only activate if the values in the list change.
   *
   * @see https://github.com/facebook/react/pull/21913
   */
  export function useInsertionEffect(
    effect: EffectCallback,
    deps?: DependencyList,
  ): void

  /**
   * @param subscribe
   * @param getSnapshot
   *
   * @see https://github.com/reactwg/react-18/discussions/86
   */
  // keep in sync with `useSyncExternalStore` from `use-sync-external-store`
  export function useSyncExternalStore<Snapshot>(
    subscribe: (onStoreChange: () => void) => () => void,
    getSnapshot: () => Snapshot,
    getServerSnapshot?: () => Snapshot,
  ): Snapshot
}
