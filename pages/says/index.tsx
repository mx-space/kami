import { observer } from 'utils/mobx'
import { SayModel, SayRespDto } from 'models/say'
import { NextPage } from 'next'
import randomColor from 'randomcolor'
import { useEffect, useState } from 'react'
import StackGrid, { transitions } from 'react-stack-grid'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { SEO } from '../../components/SEO'
import { EventTypes } from '../../common/socket/types'
import { useStore } from '../../common/store'
import { hexToRGB } from '../../utils/color'
import observable from '../../utils/observable'
import { usePrevious } from '../../common/hooks/usePrevious'
import ReactMarkdown from 'react-markdown'
const { scaleUp } = transitions
interface SayViewProps {
  data: SayModel[]
}

const SayView: NextPage<SayViewProps> = (props) => {
  const { data } = props
  const [says, setSays] = useState(data)
  const { appStore } = useStore()

  const [colors, setColors] = useState<string[]>([])
  const prevSays = usePrevious(says)
  useEffect(() => {
    if ((prevSays && prevSays.length < says.length) || !prevSays) {
      const colorMode = appStore.colorMode

      setColors(
        randomColor({
          luminosity: colorMode === 'light' ? 'bright' : 'dark',
          count: says.length,
        }),
      )
    }
  }, [appStore.colorMode, prevSays, says.length])
  useEffect(() => {
    const handler = (data: SayModel) => {
      setSays((says) => [data, ...says])
    }
    observable.on(EventTypes.SAY_CREATE, handler)

    return () => {
      observable.off(EventTypes.SAY_CREATE, handler)
    }
  }, [])

  useEffect(() => {
    const handler = (id: string) => {
      setSays((says) =>
        says.filter(({ _id }) => {
          return _id !== id
        }),
      )
    }
    observable.on(EventTypes.SAY_DELETE, handler)
    return () => {
      // this should clean all handlers
      observable.off(EventTypes.SAY_DELETE)
    }
  }, [])

  return (
    <main>
      <SEO title={'说说'} />
      <style jsx>{`
        .author {
          position: relative;
        }
        .author::before {
          content: attr(data-created);
          position: absolute;
          left: 0;
        }
      `}</style>

      {
        <StackGrid
          columnWidth={appStore.viewport.mobile ? '100%' : '50%'}
          className={'paul-say'}
          style={{ columns: 'unset' }}
          gutterWidth={10}
          gutterHeight={10}
          appear={scaleUp.appear}
          appeared={scaleUp.appeared}
          enter={scaleUp.enter}
          entered={scaleUp.entered}
          leaved={scaleUp.leaved}
          duration={1000}
        >
          {says.map((say, i) => {
            const hasSource = !!say.source
            const hasAuthor = !!say.author
            return (
              <div className={'col-6'} key={say._id}>
                <blockquote
                  key={say._id}
                  style={{
                    borderLeftColor: hexToRGB(colors[i] || '', 0.7),
                    backgroundColor: hexToRGB(colors[i] || '', 0.05),
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
                    className="author"
                    data-created={'发布于 ' + relativeTimeFromNow(say.created)}
                  >
                    {hasSource && ` 出自 “` + say.source + '”'}
                    {hasSource && hasAuthor && ', '}
                    {hasAuthor && '作者：' + say.author}
                    {!hasAuthor && !hasSource && '站长说'}
                  </p>
                </blockquote>
              </div>
            )
          })}
        </StackGrid>
      }
    </main>
  )
}

SayView.getInitialProps = async () => {
  const resp = (await Rest('Say').get('all')) as SayRespDto
  const { data } = resp
  return {
    data: data.sort(
      (b, a) => new Date(a.created).getTime() - new Date(b.created).getTime(),
    ),
  }
}

export default observer(SayView)
