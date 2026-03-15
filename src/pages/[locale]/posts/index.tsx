import { motion } from 'framer-motion'
import type { NextPage } from 'next'
import React, { Fragment, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import { useRouter } from '~/i18n/navigation'
import { useLocaleFromContext } from '~/provider/locale-context'

import type { Pager, PaginateResult, PostModel } from '@mx-space/api-client'

import { Seo } from '~/components/app/Seo'
import { PostBlock } from '~/components/in-page/Post/PostBlock'
import { TagFAB } from '~/components/in-page/Post/TagFAB'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { EmptyIcon } from '~/components/ui/Icons/for-comment'
import { Loading } from '~/components/ui/Loading'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { SearchFAB } from '~/components/widgets/Search'
import { apiClient } from '~/utils/client'
import { springScrollToTop } from '~/utils/spring'

const PostListPage: NextPage<PaginateResult<PostModel>> = () => {
  const t = useTranslations('posts')
  const [pagination, setPagination] = useState<Pager | null>(null)
  const [posts, setPosts] = useState<PostModel[]>([])

  const router = useRouter()
  const locale = useLocaleFromContext()

  const {
    query: { page: currentPage },
  } = router

  useEffect(() => {
    springScrollToTop()
  }, [currentPage])
  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page, router.query.year, locale])

  const fetch = async () => {
    const { page, year, size = 10 } = router.query as any
    const payload = await apiClient.post.getList(page, size, {
      year: +year || undefined,
      lang: locale,
    })
    setPagination(payload.pagination)
    setPosts(payload.data)
  }

  return (
    <ArticleLayout>
      <Seo title="博文" />

      <article key="note">
        {posts.length > 0 ? (
          <Fragment>
            {posts.map((post, i) => {
              return (
                <BottomToUpTransitionView
                  key={post.id}
                  timeout={{ enter: 66 * i }}
                >
                  <PostBlock
                    post={post}
                    onPinChange={() => {
                      fetch()
                    }}
                  />
                </BottomToUpTransitionView>
              )
            })}
          </Fragment>
        ) : pagination ? (
          <div className="flex flex-col">
            <EmptyIcon />
            <p>{t('empty')}</p>
            <p>{t('emptyHint')}</p>
          </div>
        ) : (
          <Loading loadingText={t('loading')} />
        )}
      </article>

      {pagination && (
        <section className="mt-4 flex justify-between">
          {pagination.hasPrevPage ? (
            <PaginationButton
              onClick={() => {
                router.push(
                  `/posts?page=${pagination.currentPage - 1}`,
                  { scroll: true },
                )
              }}
            >
              {t('prevPage')}
            </PaginationButton>
          ) : (
            <div />
          )}
          {pagination.hasNextPage && (
            <PaginationButton
              onClick={() => {
                router.push(
                  `/posts?page=${pagination.currentPage + 1}`,
                  { scroll: true },
                )
              }}
            >
              {t('nextPage')}
            </PaginationButton>
          )}
        </section>
      )}
      <TagFAB />
      <SearchFAB />
    </ArticleLayout>
  )
}

const PaginationButton = (props: { onClick: () => void; children: string }) => {
  const { onClick, children: text } = props
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="btn !border-accent !text-accent !rounded-md !border-[2px] !bg-transparent"
      onClick={onClick}
    >
      {text}
    </motion.button>
  )
}

export default PostListPage
