import { NextPage } from 'next'
import { observer } from 'mobx-react'
import { Rest } from 'utils/api'
import { SayRespDto, SayModel } from 'models/dto/say'
import { PagerModel } from 'models/dto/base'
import { relativeTimeFromNow } from 'utils/time'
import { NextSeo } from 'next-seo'
import { useStore } from 'store'

interface SayViewProps {
  page: PagerModel
  data: SayModel[]
}

const SayView: NextPage<SayViewProps> = (props) => {
  const { data } = props
  const { appStore } = useStore()
  return (
    <main>
      <NextSeo
        {...{
          title: '说说 - ' + appStore.title,
        }}
      />
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
        {data.map((say) => {
          const hasSource = !!say.source
          const hasAuthor = !!say.author
          return (
            <blockquote key={say._id}>
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
      </article>
    </main>
  )
}

SayView.getInitialProps = async () => {
  const resp = (await Rest('Say').gets({ page: 1, size: 50 })) as SayRespDto
  const { page, data } = resp
  return { page, data }
}

export default observer(SayView)
