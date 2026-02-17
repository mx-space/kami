import type { MarkdownToJSX } from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
import randomColor from 'randomcolor'
import { useMemo, useRef } from 'react'
import Masonry from 'react-masonry-css'

import { useAppStore } from '~/atoms/app'
import { useSayCollection } from '~/atoms/collections/say'
import { Seo } from '~/components/app/Seo'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { useSyncEffectOnce } from '~/hooks/common/use-sync-effect'
import { hexToRGB } from '~/utils/color'
import { relativeTimeFromNow } from '~/utils/time'

import styles from './index.module.css'

const SayView = () => {
  useSyncEffectOnce(() => {
    useSayCollection.getState().fetchAll()
  })

  const sayList = useSayCollection((state) => state.data)

  const says = Array.from(sayList.values()).sort(
    (b, a) => +new Date(a.created) - +new Date(b.created),
  )

  const colorMode = useAppStore((state) => state.colorMode)
  const colorsMap = useMemo(() => {
    return new Map(
      says.map((say) => [
        say.id,
        randomColor({
          luminosity: colorMode === 'light' ? 'bright' : 'dark',
          seed: say.id,
        }),
      ]),
    )
  }, [colorMode, says])
  const options = useRef<MarkdownToJSX.Options>({
    disableParsingRawHTML: true,
    forceBlock: true,
  }).current

  const isMobile = useAppStore((state) => state.viewport.mobile)

  return (
    <main>
      <Seo title="说说" />
      {/* TODO  new feature https://developer.mozilla.org/en-US/docs/Web/CSS/masonry-auto-flow */}
      <Masonry breakpointCols={isMobile ? 1 : 2} className={styles['kami-say']}>
        {says.map((say, i) => {
          const hasSource = !!say.source
          const hasAuthor = !!say.author
          const color = colorsMap.get(say.id)
          return (
            <BottomToUpTransitionView
              timeout={{ enter: i * 50 }}
              in
              key={say.id}
            >
              <blockquote
                key={say.id}
                className="transition-all duration-500"
                style={{
                  borderLeftColor: hexToRGB(color || '', 0.7),
                  backgroundColor: hexToRGB(color || '', 0.05),
                }}
              >
                <Markdown
                  className="mb-2"
                  options={options}
                >{`${say.text}`}</Markdown>
                <p className={styles['author']}>
                  <div className="flex-shrink-0">
                    {`发布于 ${relativeTimeFromNow(say.created)}`}
                  </div>
                  <div className="flex-shrink-0 flex-grow">
                    {hasSource && ` 出自"${say.source}"`}
                    {hasSource && hasAuthor && ', '}
                    {hasAuthor && `作者：${say.author}`}
                    {!hasAuthor && !hasSource && '站长说'}
                  </div>
                </p>
              </blockquote>
            </BottomToUpTransitionView>
          )
        })}
      </Masonry>
    </main>
  )
}

export default SayView
