import { faGithub, faQq, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { SocialLinkModel } from 'common/store/types'

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
    url: 'https://twitter.com/__oQuery',
    title: 'twitter',
    icon: faTwitter,
    color: '#02A4ED',
  },
]
export default {
  url: 'https://innei.ren',
  alwaysHTTPS:
    process.env.NODE_ENV === 'development'
      ? false
      : process.env.NEXT_PUBLIC_ALWAYS_HTTPS &&
        parseInt(process.env.NEXT_PUBLIC_ALWAYS_HTTPS) === 1,
  social,
  biliId: 26578164,
  homePage: 'https://innei.ren', // footer link

  icp: {
    name: '浙ICP备 20028356 号',
    url: 'http://beian.miit.gov.cn/',
  },
  travellings: true, // 开往
  donate: 'https://afdian.net/@Innei',
}
