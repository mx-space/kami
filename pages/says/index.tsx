import { observer } from 'mobx-react'
import { SayModel, SayRespDto } from 'models/dto/say'
import { NextPage } from 'next'
import randomColor from 'randomcolor'
import QueueAnim from 'rc-queue-anim'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { SEO } from '../../components/SEO'
import { useState, useEffect } from 'react'
import { useStore } from '../../store'
import { hexToRGB } from '../../utils/color'

interface SayViewProps {
  data: SayModel[]
}

const SayView: NextPage<SayViewProps> = (props) => {
  const { data } = props
  const { appStore } = useStore()

  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    const colorMode = appStore.colorMode

    setColors(
      randomColor({
        luminosity: colorMode === 'light' ? 'bright' : 'dark',
        count: props.data.length,
      }),
    )
  }, [appStore.colorMode, props.data.length])

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
      <article className="paul-say">
        <QueueAnim
          type={['bottom', 'right']}
          ease={['easeOutQuart', 'easeInOutQuart']}
        >
          {data.map((say, i) => {
            const hasSource = !!say.source
            const hasAuthor = !!say.author
            return (
              <blockquote
                key={say._id}
                style={{
                  borderLeftColor: hexToRGB(colors[i] || '', 0.7),
                  backgroundColor: hexToRGB(colors[i] || '', 0.05),
                  transition: 'all 0.5s',
                }}
              >
                <p>{say.text}</p>
                <p
                  className="author"
                  data-created={'发布于 ' + relativeTimeFromNow(say.created)}
                >
                  {hasSource && ` 出自 “` + say.source + '”'}
                  {hasSource && hasAuthor && ', '}
                  {hasAuthor && '作者：' + say.author}
                </p>
              </blockquote>
            )
          })}
        </QueueAnim>
      </article>
    </main>
  )
}

SayView.getInitialProps = async () => {
  const resp = (await Rest('Say').get('all')) as SayRespDto
  const { data } = resp
  return { data }
}

export default observer(SayView)
