import { uniqBy } from 'lodash-es'
import { useMemo } from 'react'

import { useInitialData, useKamiConfig } from './use-initial-data'

export const useHeaderNavList = () => {
  const {
    site: {
      header: { menu },
    },
  } = useKamiConfig()
  const { pageMeta, categories } = useInitialData()
  const mergedMenu = useMemo(() => {
    const merged = [...menu]
    const homeMenuIndex = merged.findIndex((menu) => menu.type === 'Home')
    // 1. merge pages
    const homeMenu = merged[homeMenuIndex]
    if (!homeMenu || !homeMenu.subMenu || !pageMeta) {
      return menu
    }
    const models = pageMeta.map((page) => {
      const { title, id, slug } = page
      return {
        title,
        id,
        path: `/${slug}`,
        type: 'Page',
      }
    })

    const old = homeMenu.subMenu
    homeMenu.subMenu = uniqBy([...old, ...models], 'id') as any

    // 2. merge categories
    {
      const postMenu = merged.find((menu) => menu.type === 'Post')
      if (!postMenu || !postMenu.subMenu) {
        return merged
      }
      const models = categories.map((category) => {
        const { id, slug, name } = category
        return {
          title: name,
          id,

          path: `/categories/${slug}`,
          type: 'Custom',
        }
      })
      const old = postMenu.subMenu
      postMenu.subMenu = uniqBy([...models, ...old!], 'id') as any
    }
    return merged
  }, [categories, menu, pageMeta])

  return { mergedMenu }
}
