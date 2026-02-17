import { memo, useMemo } from 'react'

import { useThemeConfig } from '~/hooks/app/use-initial-data'

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
              key="ga"
            />,
            <script
              key="ga-init"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${analyze.ga}', {page_path: window.location.pathname,});`,
              }}
            />,
          )
        }

        if (analyze.baidu) {
          tags.push(
            <script
              key="baidu-analyze"
              async
              defer
              src={`https://hm.baidu.com/hm.js?${analyze.baidu}`}
            />,
          )
        }

        if (analyze.umami.url && analyze.umami.id) {
          tags.push(
            <script
              async
              key="umami-analyze"
              defer
              data-endpoint={analyze.umami.endpoint || 'collect'}
              data-website-id={analyze.umami.id}
              data-cache="true"
              data-host-url={analyze.umami.hostUrl}
              src={`${analyze.umami.url.replace(/\/$/, '')}/${
                analyze.umami.jsname || 'umami'
              }.js`}
            />,
          )
        }

        return tags
      })(),
    [analyze.baidu, analyze.enable, analyze.ga, analyze.umami],
  )

  return <>{AnalyzeScripts}</>
})
MetaFooter.displayName = 'MetaFooter'
