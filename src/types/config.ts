export interface KamiConfig {
  name: string
  site: Site
  function: Function
}

interface Function {
  analyze: Analyze
  netease: Netease
  travellings: boolean
}

interface Analyze {
  enable: boolean
  ga: string
}

interface Netease {
  username: string
  password: null
}

interface Site {
  favicon: string
  logo_svg: string
  figure: string[]
  header: Header
  social: Social[]
  icp: ICP
  donate: Donate
  footer: Footer
  manifest: Manifest
  custom: Custom
}

interface Custom {
  script: string
  css: string
  js: string[]
}

interface Donate {
  enable: boolean
  link: string
}

interface Footer {
  home_page: string
}

interface Header {
  menu: Menu[]
}

interface Menu {
  title: string
  path: string
  type?: string
  icon: string
  subMenu?: Menu[]
}

interface ICP {
  enable: boolean
  label: string
  link: string
}

interface Manifest {
  name: string
  short_name: string
  theme_color: string
  description: string
  background_color: string
  display: string
  scope: string
  start_url: string
  lang: string
  prefer_related_applications: boolean
  icons: Icon[]
}

interface Icon {
  src: string
  sizes: string
}

interface Social {
  url: string
  title: string
  icon: string
  color: string
}
