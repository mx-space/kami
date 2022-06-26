import { Modifier, useShortcut } from 'react-shortcut-guide'

import { TrackerAction } from '~/constants/tracker'
import { apiClient } from '~/utils/client'
import { getToken } from '~/utils/cookie'

import { useAnalyze } from './use-analyze'

export const useJumpToSimpleMarkdownRender = (id: string) => {
  const { event } = useAnalyze()

  useShortcut(
    '.',
    [Modifier.None],
    () => {
      const endpoint = apiClient.endpoint
      const url = new URL(endpoint)
      location.href = `${url.protocol}//${
        url.host
      }/render/markdown/${id}${`?token=${getToken()}`}`

      event({
        action: TrackerAction.Interaction,
        label: '跳转 Markdown 渲染',
      })
    },
    '极简视图',
  )
}
