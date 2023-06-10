import type { FC } from 'react'
import { memo, useEffect, useId, useState } from 'react'

import { useAppStore } from '~/atoms/app'
import { ImageLazy } from '~/components/ui/Image'

export const Mermaid: FC<{
  content: string
}> = memo((props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [svg, setSvg] = useState('')
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()

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

    let isCanceled = false

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

      if (isCanceled) return

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
      return () => {
        isCanceled = true
      }
    })
  }, [id, props.content])

  return loading ? (
    <div className="flex min-h-[50px] items-center justify-center rounded-lg bg-[#ECECFD] text-sm dark:bg-[#1F2020]">
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
    <div className="flex min-h-[50px] items-center justify-center rounded-lg bg-red-100 text-sm">
      {error || 'Error'}
    </div>
  )
})
