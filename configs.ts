import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faHome,
  faBook,
  faPen,
  faComments,
  faFlask,
  faStar,
  faMusic,
  faTv,
} from '@fortawesome/free-solid-svg-icons'

export default {
  apiUrl: '',
  title: "Innei's Space",
  social: [
    {
      url: 'https://github.com/Innei',
      title: 'GitHub',
      icon: faGithub,
    },
  ],
  homePage: 'https://innei.ren',
  menu: [
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
      path: '/music',
      type: 'Custom',
      subMenu: [
        {
          _id: '6-1',
          title: '音乐',
          icon: faMusic,
          path: '/music',
          type: 'Music',
        },
        {
          _id: '6-2',
          title: '追番',
          icon: faTv,
          path: 'bangumi',
          type: 'Bangumi',
        },
      ],
    },
  ],
}
