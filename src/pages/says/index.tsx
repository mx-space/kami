import { observer } from 'mobx-react-lite'
import randomColor from 'randomcolor'
import { useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import Masonry from 'react-masonry-css'
import { relativeTimeFromNow } from 'utils/time'
import { SEO } from '../../components/universal/Seo'
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
        }),
      ]),
    )
  }, [appStore.colorMode, says])

  return (
    <main>
      <SEO title={'说说'} />
      <Masonry
        breakpointCols={appStore.viewport.mobile ? 1 : 2}
        className={styles['kami-say']}
      >
        {says.map((say, i) => {
          const hasSource = !!say.source
          const hasAuthor = !!say.author
          const color = colorsMap.get(say.id)
          return (
            <blockquote
              key={say.id}
              style={{
                borderLeftColor: hexToRGB(color || '', 0.7),
                backgroundColor: hexToRGB(color || '', 0.05),
                transition: 'all 0.5s',
              }}
            >
              <ReactMarkdown
                allowedTypes={[
                  'paragraph',
                  'link',
                  'inlineCode',
                  'strong',
                  'text',
                ]}
                escapeHtml={false}
              >
                {say.text}
              </ReactMarkdown>
              <p
                className={styles['author']}
                data-created={'发布于 ' + relativeTimeFromNow(say.created)}
              >
                {hasSource && ` 出自 “` + say.source + '”'}
                {hasSource && hasAuthor && ', '}
                {hasAuthor && '作者：' + say.author}
                {!hasAuthor && !hasSource && '站长说'}
              </p>
            </blockquote>
          )
        })}
      </Masonry>
    </main>
  )
}

export default observer(SayView)
