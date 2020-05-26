import { observer } from 'mobx-react'
import { SayModel, SayRespDto } from 'models/dto/say'
import { NextPage } from 'next'
import randomColor from 'randomcolor'
import QueueAnim from 'rc-queue-anim'
import { useEffect, useState } from 'react'
import { Rest } from 'utils/api'
import { relativeTimeFromNow } from 'utils/time'
import { SEO } from '../../components/SEO'
import { EventTypes } from '../../socket/types'
import { useStore } from '../../store'
import { hexToRGB } from '../../utils/color'
import observable from '../../utils/observable'
interface SayViewProps {
  data: SayModel[]
}

const SayView: NextPage<SayViewProps> = (props) => {
  const { data } = props
  const [says, setSays] = useState(data)
  const { appStore } = useStore()

  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    const colorMode = appStore.colorMode

    setColors(
      randomColor({
        luminosity: colorMode === 'light' ? 'bright' : 'dark',
        count: says.length,
      }),
    )
  }, [appStore.colorMode, says.length])
  useEffect(() => {
    const handler = (data) => {
      setSays([data, ...says])
    }
    observable.on(EventTypes.SAY_CREATE, handler)

    return () => {
      observable.off(EventTypes.SAY_CREATE, handler)
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
      <div className={'paul-say'} style={{ columns: 'unset' }}>
        <QueueAnim
          type={['bottom', 'right']}
          ease={['easeOutQuart', 'easeInOutQuart']}
          className={'row s'}
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
                  <p>{say.text}</p>
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
        </QueueAnim>
      </div>
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
