import { AggregateTop } from '@mx-space/api-client'
import { HomeIntro } from 'components/in-page/Home/intro'
import { HomeSections } from 'components/in-page/Home/section'
import { useInitialData } from 'hooks/use-initial-data'
import { omit } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import Texty from 'rc-texty'
import React, { useEffect, useState } from 'react'
import { apiClient } from 'utils/client'

const IndexView: NextPage<AggregateTop> = (props) => {
  const [say, setSay] = useState('')

  useEffect(() => {
    apiClient.say.getRandom().then(({ data }) => {
      if (!data) {
        return
      }
      setSay(`${data.text}  ——${data.author ?? data.source ?? '站长说'}`)
    })
  }, [])
  const initData = useInitialData()
  return (
    <main>
      <NextSeo
        title={initData.seo.title + ' · ' + initData.seo.description}
        description={initData.seo.description}
      />
      <HomeIntro />

      <div className="overflow-hidden leading-6 text-[#aaa] my-[2rem]">
        <Texty appear leave={false} type={'alpha'}>
          {say}
        </Texty>
      </div>

      <HomeSections {...props} />
    </main>
  )
}

IndexView.getInitialProps = async () => {
  const aggregateData = await apiClient.aggregate.getTop()

  return omit(aggregateData, ['says']) as any
}

export default observer(IndexView)
