import { useIsClient } from '~/hooks/use-is-client'

export function NoSSRWrapper<T>(FC: T): T {
  const isClient = useIsClient()

  return isClient ? FC : ((() => null) as any)
}
