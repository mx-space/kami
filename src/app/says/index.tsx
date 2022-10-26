import type { MarkdownToJSX } from 'markdown-to-jsx'
import Markdown from 'markdown-to-jsx'
import { observer } from 'mobx-react-lite'
import randomColor from 'randomcolor'
import { useEffect, useMemo, useRef } from 'react'
import Masonry from 'react-masonry-css'
import { TransitionGroup } from 'react-transition-group'

import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
import { relativeTimeFromNow } from '~/utils/time'

import { SEO } from '../../components/biz/Seo'
import { useStore } from '../../store'
import { hexToRGB } from '../../utils/color'
import styles from './index.module.css'

const SayView = () => {
  const { sayStore, appStore } = useStore()
  useEffect(() => {
    sayStore.fetchAll()
  }, [])

  const says = sayStore.list.sort(
    (b, a) => +new Date(a.created) - +new Date(b.created),
  )
  const colorsMap = useMemo(() => {
    return new Map(
      says.map((say) => [
        say.id,
        randomColor({
          luminosity: appStore.colorMode === 'light' ? 'bright' : 'dark',
          seed: say.id,
        }),
      ]),
    )
  }, [appStore.colorMode, says])
  const options = useRef<MarkdownToJSX.Options>({
    disableParsingRawHTML: true,
    forceBlock: true,
  }).current
  return (
    <main>
      <SEO title={'说说'} />
      <TransitionGroup>
        <Masonry
          breakpointCols={appStore.viewport.mobile ? 1 : 2}
          className={styles['kami-say']}
        >
          {says.map((say, i) => {
            const hasSource = !!say.source
            const hasAuthor = !!say.author
            const color = colorsMap.get(say.id)
            return (
              <BottomUpTransitionView
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
                      {hasSource && ` 出自 “${say.source}”`}
                      {hasSource && hasAuthor && ', '}
                      {hasAuthor && `作者：${say.author}`}
                      {!hasAuthor && !hasSource && '站长说'}
                    </div>
                  </p>
                </blockquote>
              </BottomUpTransitionView>
            )
          })}
        </Masonry>
      </TransitionGroup>
    </main>
  )
}

export default observer(SayView)
