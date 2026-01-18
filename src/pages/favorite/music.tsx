import type { NextPage } from 'next'
import { useCallback } from 'react'
import { message } from 'react-message-popup'
import useSWR from 'swr'

import { ErrorView } from '~/components/app/Error'
import { Seo } from '~/components/app/Seo'
import type { PlayListType } from '~/components/in-page/SectionMusic'
import { SectionMusic } from '~/components/in-page/SectionMusic'
import { RiNeteaseCloudMusicFill } from '~/components/ui/Icons/for-fav'
import { Loading } from '~/components/ui/Loading'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { apiClient } from '~/utils/client'

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
  const { data, isLoading, error } = useSWR<MusicData>('kami-music', async () => {
    try {
      const res = await apiClient.serverless.proxy.kami.netease.get<any>()
      return res as MusicData
    } catch (err: any) {
      message.error(err?.message || '请求失败')
      throw err
    }
  })

  const { event } = useAnalyze()
  const trackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '音乐页面点击去个人主页',
    })
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (error || !data) {
    return (
      <ErrorView
        statusCode={404}
        description="音乐功能依赖后端 serverless 代理（proxy/kami/*），当前未配置或接口不可用"
        showBackButton
        showRefreshButton
      />
    )
  }

  return (
    <main>
      <Seo title="歌单" />

      {data.detail && (
        <div className="phone:justify-center my-2 flex justify-end">
          <a
            href={`https://music.163.com/#/user/home?id=${data.detail.userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="phone:flex-col phone:space-y-4 phone:mb-4 flex items-center justify-center"
            onClick={trackerClick}
          >
            <RiNeteaseCloudMusicFill height="3rem" width="3rem" />

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
