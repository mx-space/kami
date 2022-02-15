import { useThemeConfig } from 'hooks/use-initial-data'
import { memo, useMemo } from 'react'

export const MetaFooter = memo(() => {
  const themeConfig = useThemeConfig()
  const analyze = themeConfig.function.analyze
  const AnalyzeScripts = useMemo(
    () =>
      analyze.enable &&
      (() => {
        const tags = [] as React.ReactNode[]
        if (analyze.ga) {
          tags.push(
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${analyze.ga}`}
            />,
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${analyze.ga}', {page_path: window.location.pathname,});`,
              }}
            />,
          )
        }

        if (analyze.baidu) {
          tags.push(
            <script
              async
              src={`https://hm.baidu.com/hm.js?${analyze.baidu}`}
            />,
          )
        }

        if (analyze.umami.url && analyze.umami.id) {
          tags.push(
            <script
              async
              defer
              data-website-id={analyze.umami.id}
              src={`${analyze.umami.url.replace(/\/$/, '')}/umami.js`}
            ></script>,
          )
        }

        return tags
      })(),
    [analyze.baidu, analyze.enable, analyze.ga, analyze.umami],
  )

  return <>{AnalyzeScripts}</>
})
