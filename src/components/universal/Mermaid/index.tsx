import type { FC } from 'react'
import { memo, useEffect, useId, useState } from 'react'

import { ImageLazy } from '@mx-space/kami-design/components/Image'

import { useAppStore } from '~/atoms/app'
import { useIsUnMounted } from '~/hooks/use-is-unmounted'

export const Mermaid: FC<{
  content: string
}> = memo((props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [svg, setSvg] = useState('')
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()
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

  const id = useId().split(':').join('')

  useEffect(() => {
    if (!props.content) {
      return
    }
    setError('')
    setLoading(true)

    import('mermaid').then(async (mo) => {
      const mermaid = mo.default

      let result
      try {
        result = await mermaid.render(`mermaid-${id}`, props.content)
      } catch (error) {
        document.getElementById(`dmermaid-${id}`)?.remove()
        if (error instanceof Error) {
          setError(error.message)
        }
        setSvg('')
        setWidth(undefined)
        setHeight(undefined)
      }

      if (isUnmounted.current) return

      if (result) {
        setSvg(result.svg)

        const match = result.svg.match(/viewBox="[^"]*\s([\d.]+)\s([\d.]+)"/)
        if (match?.[1] && match?.[2]) {
          setWidth(parseInt(match?.[1]))
          setHeight(parseInt(match?.[2]))
        }
        setError('')
      }
      setLoading(false)
    })
  }, [id, props.content])

  return loading ? (
    <div className="min-h-[50px] rounded-lg flex items-center justify-center bg-[#ECECFD] dark:bg-[#1F2020] text-sm">
      Mermaid Loading...
    </div>
  ) : svg ? (
    <div>
      <ImageLazy
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`}
        width={width}
        height={height}
        popup
      />
    </div>
  ) : (
    <div className="min-h-[50px] rounded-lg flex items-center justify-center bg-red-100 text-sm">
      {error || 'Error'}
    </div>
  )
})
