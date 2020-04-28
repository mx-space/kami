import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  faHome,
  faBook,
  faPen,
  faComments,
  faFlask,
  faStar,
  faMusic,
  faTv,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'
import { SocialLinkModel, MenuModel } from 'store/types'
import { faClock } from '@fortawesome/free-regular-svg-icons'
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
    url: 'https://twitter.com/',
    title: 'Twitter',
    icon: faTwitter,
    color: '#00A3EC',
  },
]
export default {
  APIURL: 'http://47.114.54.60:2333',
  title: '示例站点', // prefetch seo
  description: '欢迎来到我的小窝',
  avatar:
    'https://avatars2.githubusercontent.com/u/41265413?s=460&u=12cefe5e6d2d75766dc455cec96336e73d7b951b&v=4', // work on rss
  url: 'https://innei.ren',
  keywords: ['blog', 'space', 'mx-space', 'innei', '静之森', '静かな森'],
  social,
  biliId: 26578164,
  homePage: 'https://innei.ren', // footer link
  menu,
}
