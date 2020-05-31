import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'mobx-react'
import { PageRespDto } from 'models/dto/page'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import RemoveMarkdown from 'remove-markdown'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import { useEffect } from 'react'

const Page: NextPage<PageRespDto> = (props) => {
  const { data } = props
  const { title, subtitle, text } = data
  const { appStore } = useStore()

  useEffect(() => {
    appStore.headerNav = {
      title,
      meta: subtitle,
      show: true,
    }
    return () => {
      appStore.headerNav.show = false
    }
  }, [appStore, subtitle, title])
  return (
    <ArticleLayout title={title} subtitle={subtitle}>
      <NextSeo
        title={title + ' - ' + appStore.title}
        description={RemoveMarkdown(text).slice(0, 100).replace('\n', '')}
      />
      <Markdown value={text} escapeHtml={false} />

      <CommentLazy
        {...{
          type: 'Page',
          id: props.data._id,
          allowComment: props.data.allowComment ?? true,
        }}
      />
    </ArticleLayout>
  )
}
Page.getInitialProps = async (ctx) => {
  const { data } = await Rest('Page', 'slug').get<PageRespDto>(
    ctx.query.page as string,
  )
  return { data } as PageRespDto
}

export default observer(Page)
