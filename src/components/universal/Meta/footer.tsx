import { useThemeConfig } from 'hooks/use-initial-data'
import { memo, useMemo } from 'react'

export const MetaFooter = memo(() => {
  const themeConfig = useThemeConfig()

  const AnalyzeScripts = useMemo(
    () =>
      themeConfig.function.analyze.enable &&
      (() => {
        const tags = [] as React.ReactNode[]
        if (themeConfig.function.analyze.ga) {
          tags.push(
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${themeConfig.function.analyze.ga}`}
            />,
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${themeConfig.function.analyze.ga}', {page_path: window.location.pathname,});`,
              }}
            />,
          )
        }

        if (themeConfig.function.analyze.baidu) {
          tags.push(
            <script
              async
              src={`https://hm.baidu.com/hm.js?${themeConfig.function.analyze.baidu}`}
            />,
          )
        }

        return tags
      })(),
    [
      themeConfig.function.analyze.baidu,
      themeConfig.function.analyze.enable,
      themeConfig.function.analyze.ga,
    ],
  )

  return <>{AnalyzeScripts}</>
})
