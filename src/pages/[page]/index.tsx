import { PageModel } from '@mx-space/api-client'
import { useStore } from 'common/store'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import React, { Fragment, useEffect } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { apiClient } from 'utils/client'
import { imagesRecord2Map } from 'utils/images'
import { observer } from 'utils/mobx'
import { CommentLazy } from 'views/Comment'
import Markdown from 'views/Markdown'
import { ImageSizeMetaContext } from '../../common/context/ImageSizes'
import { Seo } from '../../components/SEO'
import styles from './index.module.css'

const Page: NextPage<PageModel> = (props) => {
  const data = props
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
      meta: subtitle || '',
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
  const pages = appStore.pages
  const indexInPages = pages.findIndex((i) => i.title == props.title)
  const n = pages.length
  const hasNext = indexInPages + 1 < n
  const hasPrev = indexInPages - 1 >= 0
  return (
    <ArticleLayout title={title} subtitle={subtitle} id={props.id} type="page">
      <Seo
        title={title}
        openGraph={{ type: 'article' }}
        description={RemoveMarkdown(text).slice(0, 100).replace('\n', '')}
      />
      <ImageSizeMetaContext.Provider
        value={imagesRecord2Map(props.images || [])}
      >
        <Markdown value={text} escapeHtml={false} toc />
      </ImageSizeMetaContext.Provider>
      <div className={styles['pagination']}>
        <div className="">
          {hasPrev && (
            <Fragment>
              {/* <FontAwesomeIcon
                icon={faArrowAltCircleLeft}
                className="mr-3 text-2xl"
              /> */}
              <Link href={`/${pages[indexInPages - 1].slug}`}>
                <a className="flex flex-col justify-end">
                  <h2 className="text-indigo-400">回顾一下：</h2>
                  <p className="text-left">{pages[indexInPages - 1].title}</p>
                </a>
              </Link>
            </Fragment>
          )}
        </div>
        <div className="">
          {hasNext && (
            <Fragment>
              <Link href={`/${pages[indexInPages + 1].slug}`}>
                <a className="flex flex-col justify-end">
                  <h2 className="text-indigo-400">继续了解：</h2>
                  <p className="text-right">{pages[indexInPages + 1].title}</p>
                </a>
              </Link>
              {/* <FontAwesomeIcon
                icon={faArrowAltCircleRight}
                className="ml-3 text-2xl"
              /> */}
            </Fragment>
          )}
        </div>
      </div>
      <CommentLazy
        {...{
          type: 'Page',
          id: props.id,
          allowComment: props.allowComment ?? true,
        }}
      />
    </ArticleLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const data = await apiClient.page.getBySlug(ctx.query.page as any)

    return {
      props: data,
    }
  } catch {
    return {
      notFound: true,
    }
  }
}
export default observer(Page)
