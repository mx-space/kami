import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { useAppStore } from '~/atoms/app'
import { useIsUnMounted } from '~/hooks/use-is-unmounted'

export const Mermaid: FC<{ content: string }> = (props) => {
  const [loading, setLoading] = useState(true)
  const [svg, setSvg] = useState('')
  const isUnmounted = useIsUnMounted()

  const isDark = useAppStore((state) => state.colorMode === 'dark')

  useEffect(() => {
    import('mermaid').then(async (mo) => {
      const mermaid = mo.default
      mermaid.initialize({
        theme: isDark ? 'dark' : 'default',
      })
    })
  }, [isDark])

  useEffect(() => {
    import('mermaid').then(async (mo) => {
      const mermaid = mo.default
      const result = await mermaid.render('mermaid', props.content)

      if (isUnmounted.current) return
      setSvg(result.svg)
      setLoading(false)
    })
  }, [props.content])

  return loading ? (
    <div className="h-[50px] rounded-lg flex items-center justify-center bg-[#ECECFD] dark:bg-[#1F2020] text-sm">
      Mermaid 加载中...
    </div>
  ) : (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
  )
}
