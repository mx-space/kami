import type { FC } from 'react'

import { useRouter } from '~/i18n/navigation'
import React, { Fragment, memo } from 'react'

import { useInitialData } from '~/hooks/app/use-initial-data'

import {
  HeaderActionButton,
  HeaderActionButtonsContainer,
  HeaderActionLikeButtonForNote,
} from './HeaderActionButton'
import { HeaderActionShareButton } from './HeaderActionShareButton'
import styles from './index.module.css'

export const HeaderActionBasedOnRouterPath: FC = memo(() => {
  const router = useRouter()
  const pathname = router.pathname
  const {
    seo: { title },
  } = useInitialData()

  const Comp = (() => {
    const titleComp = <div className={styles['site-info']}>{title}</div>
    switch (pathname) {
      case '/[locale]/notes/[id]':
      case '/notes/[id]': {
        const id = parseInt(router.query.id as any)

        if (id && typeof id === 'number') {
          return (
            <>
              <HeaderActionButtonsContainer>
                <HeaderActionShareButton />
                <HeaderActionButton className="h-10 w-20" tabIndex={-1}>
                  <HeaderActionLikeButtonForNote id={id} />
                </HeaderActionButton>
              </HeaderActionButtonsContainer>
              <div className="flex flex-shrink-0 flex-col">
                <span>{id}</span>
                {titleComp}
              </div>
            </>
          )
        }
        return null
      }

      case '/[locale]/[page]':
      case '/[page]': {
        return (
          <Fragment>
            <HeaderActionShareButton />
            <div className="flex flex-shrink-0 flex-col">
              <span>/{router.query.page}</span>
              {titleComp}
            </div>
          </Fragment>
        )
      }
      default: {
        return (
          <Fragment>
            <HeaderActionShareButton />
            {titleComp}
          </Fragment>
        )
      }
    }
  })()

  return <Fragment>{Comp}</Fragment>
})
