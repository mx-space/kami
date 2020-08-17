import { useStore } from 'common/store'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'utils/mobx'
import { PageRespDto } from 'models/page'
import { NextPage } from 'next'
import { useEffect } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { Rest } from 'utils/api'
import { ImageSizesContext } from '../../common/context/ImageSizes'
import { Seo } from '../../components/SEO'

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
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [props])
  return (
    <ArticleLayout title={title} subtitle={subtitle}>
      <Seo
        title={title}
        description={RemoveMarkdown(text).slice(0, 100).replace('\n', '')}
      />
      <ImageSizesContext.Provider value={props.data.images}>
        <Markdown value={text} escapeHtml={false} showTOC />
      </ImageSizesContext.Provider>

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
