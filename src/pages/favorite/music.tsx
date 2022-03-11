import { PlayListType, SectionMusic } from 'components/in-page/SectionMusic'
import { Loading } from 'components/universal/Loading'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { message } from 'react-message-popup'
import { apiClient } from 'utils'
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
  uid: number
}

const MusicView: NextPage = () => {
  const [data, setData] = useState<null | MusicData>(null)

  useEffect(() => {
    apiClient.snippet.proxy.kami.netease
      .get<any>()
      .then((res) => {
        setData(res)
      })
      .catch((err) => {
        message.error(err.message)
      })
  }, [])

  if (!data) {
    return <Loading />
  }

  return (
    <main>
      <Seo title={`歌单`} openGraph={{ type: 'website' }} />

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
