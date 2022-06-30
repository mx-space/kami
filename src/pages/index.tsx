import omit from 'lodash-es/omit'
import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { createContext, useContext, useEffect } from 'react'

import type { AggregateTop } from '@mx-space/api-client'

import { HomeIntro } from '~/components/in-page/Home/intro'
import { HomeRandomSay } from '~/components/in-page/Home/random-say'
import { HomeSections } from '~/components/in-page/Home/section'
import { useModalStack } from '~/components/universal/Modal/stack.context'
import { useInitialData } from '~/hooks/use-initial-data'
import { apiClient } from '~/utils/client'
import { Notice } from '~/utils/notice'

const IndexViewContext = createContext({ doAnimation: true })

export const useIndexViewContext = () => useContext(IndexViewContext)

const IndexView: NextPage<AggregateTop> = (props) => {
  const initData = useInitialData()

  const doAnimation = Boolean(
    globalThis.history
      ? !history.backPath || history.backPath.length === 0
      : false,
  )

  useEffect(() => {
    Notice.shared.initNotice()
  }, [])

  const { popup } = useModalStack()
  useEffect(() => {
    popup({
      component: <div>111</div>,
    })

    popup({
      component: <div>2222</div>,
    })
  }, [])

  return (
    <main>
      <IndexViewContext.Provider value={{ doAnimation }}>
        <NextSeo
          title={`${initData.seo.title} · ${initData.seo.description}`}
          description={initData.seo.description}
        />
        <HomeIntro />

        <HomeRandomSay />
        <HomeSections {...props} />
      </IndexViewContext.Provider>
    </main>
  )
}

IndexView.getInitialProps = async () => {
  const aggregateData = await apiClient.aggregate.getTop()

  return omit(aggregateData, ['says']) as any
}

export default observer(IndexView)
