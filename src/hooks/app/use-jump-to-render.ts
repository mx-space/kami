import { useRef } from 'react'
import { Modifier, useShortcut } from 'react-shortcut-guide'

import { TrackerAction } from '~/constants/tracker'
import { apiClient } from '~/utils/client'
import { getToken } from '~/utils/cookie'

import { useAnalyze } from './use-analyze'

export const useJumpToSimpleMarkdownRender = (id: string) => {
  const { event } = useAnalyze()

  const handlerRef = useRef(() => {})

  handlerRef.current = () => {
    const endpoint = apiClient.endpoint
    const url = new URL(endpoint)
    const token = getToken()
    location.href = `${url.protocol}//${url.host}/render/markdown/${id}${
      token ? `?token=${token}` : ''
    }`

    event({
      action: TrackerAction.Interaction,
      label: '跳转 KamiMarkdown 渲染',
    })
  }

  useShortcut(
    '.',
    [Modifier.None],
    () => {
      handlerRef.current()
    },
    '极简视图',
  )
}
