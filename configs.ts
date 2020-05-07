import { faGithub, faQq } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import {
  faBook,
  faComments,
  faFlask,
  faHome,
  faMusic,
  faPen,
  faStar,
  faTv,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'
import { MenuModel, SocialLinkModel } from 'store/types'
const menu: MenuModel[] = [
  {
    _id: '1',
    title: '主页',
    type: 'Home',
    path: '/',
    icon: faHome,
    subMenu: [],
  },
  {
    _id: '2',
    title: '博文',
    type: 'Post',
    path: '/posts',
    subMenu: [],
    icon: faBook,
  },
  {
    _id: '3',
    title: '日记',
    type: 'Note',
    path: '/notes',
    icon: faPen,
  },
  {
    _id: '4',
    title: '说说',
    type: 'Custom',
    path: '/says',
    icon: faComments,
  },
  {
    _id: '5',
    title: '项目',
    icon: faFlask,
    path: '/projects',
    type: 'Project',
  },
  {
    _id: '6',
    title: '兴趣',
    icon: faStar,
    path: '/favorite/music',
    type: 'Custom',
    subMenu: [
      {
        _id: '6-1',
        title: '音乐',
        icon: faMusic,
        path: '/favorite/music',
        type: 'Music',
      },
      {
        _id: '6-2',
        title: '追番',
        icon: faTv,
        path: '/favorite/bangumi',
        type: 'Bangumi',
      },
    ],
  },
  {
    _id: '7',
    title: '时间线',
    icon: faClock,
    type: 'Custom',
    path: '/timeline',
  },
  {
    _id: '8',
    title: '好友们',
    icon: faUserFriends,
    type: 'Custom',
    path: '/friends',
  },
]
const social: SocialLinkModel[] = [
  {
    url: 'https://github.com/Innei',
    title: 'GitHub',
    icon: faGithub,
    color: 'var(--black)',
  },
  {
    url: 'https://jq.qq.com/?_wv=1027&k=5t9N0mw',
    title: 'QQ',
    icon: faQq,
    color: '#12b7f5',
  },
]
export default {
  APIURL: 'http://example.com',
  title: '静かな森', // prefetch seo
  description: '致虚极，守静笃。',
  avatar:
    'https://tu-1252943311.cos.ap-shanghai.myqcloud.com/%E5%A7%94%E6%89%98%E5%A4%B4%E5%83%8F.png', // work on rss
  url: 'https://innei.ren',
  keywords: ['blog', 'space', 'mx-space', 'innei', '静之森', '静かな森'],
  alwaysHTTPS: process.env.NODE_ENV === 'development' ? false : true,
  social,
  biliId: 26578164,
  homePage: 'https://innei.ren', // footer link
  menu,
}
