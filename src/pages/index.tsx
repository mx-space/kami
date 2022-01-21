import { AggregateTop } from '@mx-space/api-client'
import { HomeIntro } from 'components/in-page/Home/intro'
import { HomeRandomSay } from 'components/in-page/Home/random-say'
import { HomeSections } from 'components/in-page/Home/section'
import { useInitialData } from 'hooks/use-initial-data'
import { omit } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import React, { createContext, useContext } from 'react'
import { apiClient } from 'utils/client'

const IndexViewContext = createContext({ doAnimation: true })

export const useIndexViewContext = () => useContext(IndexViewContext)

const IndexView: NextPage<AggregateTop> = (props) => {
  const initData = useInitialData()

  const doAnimation = Boolean(
    globalThis.history
      ? !history.backPath || history.backPath.length === 0
      : false,
  )

  return (
    <main>
      <IndexViewContext.Provider value={{ doAnimation }}>
        <NextSeo
          title={initData.seo.title + ' · ' + initData.seo.description}
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
