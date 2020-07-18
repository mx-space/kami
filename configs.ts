import { faGithub, faQq, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import {
  faBook,
  faBookOpen,
  faComments,
  faFlask,
  faHome,
  faMusic,
  faPen,
  faStar,
  faTv,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons'
import { MenuModel, SocialLinkModel } from 'common/store/types'
const menu: MenuModel[] = [
  {
    title: '主页',
    path: '/',
    type: 'Home',
    icon: faHome,
    subMenu: [],
  },
  {
    title: '博文',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: faBook,
  },
  {
    title: '生活',
    type: 'Note',
    path: '/notes',
    icon: faPen,
  },
  {
    title: '说说',
    path: '/says',
    icon: faComments,
  },
  {
    title: '时间线',
    icon: faClock,
    path: '/timeline',
    subMenu: [
      {
        title: '生活',
        icon: faPen,
        path: '/timeline?type=note',
      },
      {
        title: '博文',
        icon: faBookOpen,
        path: '/timeline?type=post',
      },
    ],
  },
  {
    title: '朋友们',
    icon: faUserFriends,
    path: '/friends',
  },
  {
    title: '更多',
    icon: faStar,
    path: '/favorite/music',
    subMenu: [
      {
        title: '音乐',
        icon: faMusic,
        type: 'Music',
        path: '/favorite/music',
      },
      {
        title: '追番',
        icon: faTv,
        type: 'Bangumi',
        path: '/favorite/bangumi',
      },
      {
        title: '项目',
        icon: faFlask,
        type: 'Project',
        path: '/projects',
      },
    ],
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
  {
    url: 'https://twitter.com/_oQuery',
    title: 'twitter',
    icon: faTwitter,
    color: '#02A4ED',
  },
]
export default {
  title: '静かな森', // prefetch seo
  description: '致虚极，守静笃。',
  avatar: 'https://tu-1252943311.file.myqcloud.com/avatar.png', // work on rss
  url: 'https://innei.ren',
  keywords: ['blog', 'space', 'mx-space', 'innei', '静之森', '静かな森'],
  author: 'Innei', // for ssr render
  alwaysHTTPS:
    process.env.NODE_ENV === 'development'
      ? false
      : process.env.ALWAYS_HTTPS && parseInt(process.env.ALWAYS_HTTPS) === 1,
  social,
  biliId: 26578164,
  homePage: 'https://innei.ren', // footer link
  menu,
  icp: {
    name: '萌ICP备 20200520520 号',
    url: 'https://icp.gov.moe/?keyword=20200520520',
  },
  travellings: true, // 开往
  donate: 'https://afdian.net/@Innei',
}
