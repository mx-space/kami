import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { message } from 'react-message-popup'
import { apiClient } from 'utils'

import type { PlayListType } from '~/components/in-page/SectionMusic'
import { SectionMusic } from '~/components/in-page/SectionMusic'
import { RiNeteaseCloudMusicFill } from '~/components/universal/Icons'
import { Loading } from '~/components/universal/Loading'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'

import { Seo } from '../../components/universal/Seo'

interface PersonalPlayListType {
  id: number
  coverImgUrl: string
  coverImgId: number
  playCount: number
  name: string
  data: PlayListType[]
}

interface MusicData {
  weekdata: PlayListType[]
  alldata: PlayListType[]
  playlist: PersonalPlayListType
  detail?: any
  uid: number
}

const MusicView: NextPage = () => {
  const [data, setData] = useState<null | MusicData>(null)

  useEffect(() => {
    apiClient.serverless.proxy.kami.netease
      .get<any>()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        message.error(err.message)
      })
  }, [])
  const { event } = useAnalyze()
  const trackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '音乐页面点击去个人主页',
    })
  }, [])
  if (!data) {
    return <Loading />
  }

  return (
    <main>
      <Seo title={`歌单`} />

      {data.detail && (
        <div className="flex my-2 justify-end">
          <a
            href={`https://music.163.com/#/user/home?id=${data.detail.userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
            onClick={trackerClick}
          >
            <RiNeteaseCloudMusicFill height={'3rem'} width={'3rem'} />

            <span className="ml-2">{data.detail.nickname}</span>
          </a>
        </div>
      )}

      <SectionMusic
        name="周排行"
        src="https://p3.music.126.net/4HGEnXVexEfBACKi7wbq8A==/3390893860854924.jpg"
        data={data.weekdata}
      />
      <SectionMusic
        name="总排行"
        data={data.alldata}
        src="https://p1.music.126.net/xTCCKfCJuEh2ohPZDNMDLw==/19193074975054252.jpg"
      />
      <SectionMusic
        name={data.playlist.name}
        src={data.playlist.coverImgUrl}
        data={data.playlist.data.slice(0, 10)}
      />
    </main>
  )
}

export default MusicView
