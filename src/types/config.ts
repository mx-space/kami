export interface KamiConfig {
  name: string
  site: Site
  function: Function
  page: Page
}

interface Function {
  comment: {
    disable: boolean
  }
  analyze: {
    enable: boolean
    ga: string
    baidu: string
    umami: {
      url: string
      id: string
      jsname: string
      endpoint?: string
      hostUrl?: string
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

export interface ThemeColor {
  light: string
  dark: string
  lightHover?: string
  darkHover?: string
}

export interface SecondaryColor {
  light: string
  dark: string
}
interface Site {
  themeColor?: ThemeColor | string
  secondaryColor?: SecondaryColor | string
  favicon: string
  subtitle?: string | null
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

export interface Page {
  home: HomePage
}

export type HomePageSectionName = 'post' | 'note' | 'friend' | 'more'
// page.home
export interface HomePage {
  sections: HomePageSectionName[]
  titleMapping: {
    [key in HomePageSectionName]?: string
  }
  more: IHomePageMoreSection[]
}

export interface IHomePageMoreSection extends Navigation {
  desc: string
  type?: 'like' | 'subscribe'
  cover?: string
}
