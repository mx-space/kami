import { useStore } from 'common/store'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/MD-render'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { PageRespDto } from 'models/page'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { Rest } from 'utils/api'
import { imagesRecord2Map } from 'utils/images'
import { observer } from 'utils/mobx'
import { ImageSizeMetaContext } from '../../common/context/ImageSizes'
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
        openGraph={{ type: 'article' }}
        description={RemoveMarkdown(text).slice(0, 100).replace('\n', '')}
      />
      <ImageSizeMetaContext.Provider
        value={imagesRecord2Map(props.data.images)}
      >
        <Markdown value={text} escapeHtml={false} toc />
      </ImageSizeMetaContext.Provider>

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { data } = await Rest('Page', 'slug').get<PageRespDto>(
      ctx.query.page as string,
    )

    return {
      props: { data },
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
export default observer(Page)
