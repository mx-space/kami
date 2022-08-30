export interface KamiConfig {
  name: string
  site: Site
  function: Function
}

interface Function {
  analyze: {
    enable: boolean
    ga: string
    baidu: string
    umami: {
      url: string
      id: string
      jsname: string
      endpoint?: string
    }
  }

  donate: {
    enable: boolean
    link: string
    qrcode: string[]
  }

  player: {
    id: number[]
  }

  banDevtool: {
    enable: boolean
  }

  notification?: {
    [key: string]: NotificationType
  }
}

interface NotificationType {
  title?: string
  message: string
  toLink?: string
  icon?: string
}

interface Site {
  favicon: string
  logoSvg?: string
  figure?: string[]
  header: Header
  social: Social[]
  footer: Footer
  custom: Custom

  background: Background
}

interface Background {
  src: {
    light: string
    dark: string
  }
  position: string
}

interface Custom {
  script?: string
  css?: string[]
  style?: string
  js?: string[]
}

interface Footer {
  homePage: string
  motto: Motto
  icp: ICP
  background: Background
  navigation: Navigation[]
}
interface Navigation {
  newtab?: boolean
  name: string
  path: string
}

interface ICP {
  enable: boolean
  label: string
  link: string
}

interface Motto {
  content: string
  author: string
}

interface Header {
  menu: Menu[]
}

export interface Menu {
  title: string
  path: string
  type?: string
  icon: string
  subMenu?: Menu[]
}

interface Social {
  url: string
  title: string
  icon: string
  color: string
}
