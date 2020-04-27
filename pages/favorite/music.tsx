import { NextPage } from 'next'
import { FavoriteNav } from './components/nav'
import axios from 'axios'
import { SectionMusic } from 'components/SectionMusic'
interface MusicProps {
  weekdata: {
    id: number
    time: string
    picUrl: string
    name: string
    author: string
    playCount: any
  }[]
  alldata: {
    id: number
    time: string
    picUrl: string
    name: string
    author: string
    playCount: any
  }[]
  uid: number
}

const MusicView: NextPage<MusicProps> = (props) => {
  return (
    <main>
      <FavoriteNav index={0} />
      <SectionMusic
        {...{
          name: '周排行',
          src:
            'https://p3.music.126.net/4HGEnXVexEfBACKi7wbq8A==/3390893860854924.jpg',
          data: props.weekdata,
        }}
      />
      <SectionMusic
        {...{
          name: '总排行',
          src:
            'https://p1.music.126.net/xTCCKfCJuEh2ohPZDNMDLw==/19193074975054252.jpg',
          data: props.alldata,
        }}
      />
    </main>
  )
}

MusicView.getInitialProps = async () => {
  const $api = axios.create({
    baseURL: 'http://127.0.0.1:' + process.env.PORT || '2323',
  })
  const { data } = await $api.get('_extra/music')

  return data as MusicProps
}

export default MusicView
