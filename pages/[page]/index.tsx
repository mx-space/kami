/*
 * @Author: Innei
 * @Date: 2021-01-01 16:00:14
 * @LastEditTime: 2021-02-12 20:04:17
 * @LastEditors: Innei
 * @FilePath: /web/pages/[page]/index.tsx
 * @Mark: Coding with Love
 */
import { useStore } from 'common/store'
import { CommentLazy } from 'components/Comment'
import Markdown from 'components/Markdown'
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
    appStore.shareData = {
      text,
      title,
      url: location.href,
    }
    return () => {
      appStore.shareData = null
    }
  }, [text, title])
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
    <ArticleLayout
      title={title}
      subtitle={subtitle}
      id={props.data.id}
      type="page"
    >
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
          id: props.data.id,
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
