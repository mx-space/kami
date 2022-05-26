// sync with config.init.yaml
export const defaultConfigs = {
  name: 'kami',
  site: {
    favicon: '/favicon.svg',
    logoSvg: null,
    figure: null,
    background: {
      src: {
        light: '/assets/background.png',
        dark: '/assets/background-night.png',
      },
      position: 'top center fixed',
    },
    header: {
      menu: [
        {
          title: '源',
          path: '/',
          type: 'Home',
          icon: 'faDotCircle',
          subMenu: [],
        },
        {
          title: '文',
          path: '/posts',
          type: 'Post',
          subMenu: [],
          icon: 'faGlasses',
        },
        {
          title: '记',
          type: 'Note',
          path: '/notes/latest',
          icon: 'faFeatherAlt',
        },
        {
          title: '言',
          path: '/says',
          icon: 'faComments',
        },
        {
          title: '览',
          icon: 'faHistory',
          path: '/timeline',
          subMenu: [
            {
              title: '生活',
              icon: 'faFeatherAlt',
              path: '/timeline?type=note',
            },
            {
              title: '博文',
              icon: 'faBookOpen',
              path: '/timeline?type=post',
            },
            {
              title: '回忆',
              icon: 'faCircle',
              path: '/timeline?memory=1',
            },
          ],
        },
        {
          title: '友',
          icon: 'faUserFriends',
          path: '/friends',
        },
        {
          title: '诉',
          icon: 'faComment',
          path: '/recently',
        },
        {
          title: '余',
          icon: 'faCircleNotch',
          path: '/favorite/music',
          subMenu: [
            {
              title: '听歌',
              icon: 'faMusic',
              type: 'Music',
              path: '/favorite/music',
            },
            {
              title: '项目',
              icon: 'faFlask',
              path: '/projects',
            },
          ],
        },
        {
          title: '',
          icon: 'faSubway',
          path: 'https://travellings.link',
        },
      ],
    },
    social: [],
    footer: {
      background: {
        src: {
          dark: '',
          light: '/assets/footer.png',
        },
        position: 'top/cover',
      },
      homePage: '/',
      motto: {
        content: 'Stay hungry. Stay foolish.',
        author: 'Steve Jobs',
      },
      icp: {
        enable: false,
        label: '萌备 20201212 号',
        link: 'https://icp.gov.moe/',
      },
      navigation: [
        {
          name: '关于',
          path: '/about',
        },
        {
          name: '留言',
          path: '/message',
        },
        {
          name: '友链',
          path: '/friends',
        },
        {
          name: 'RSS 订阅',
          path: '/feed',
          newtab: true,
        },
        {
          name: '站点地图',
          path: '/sitemap',
          newtab: true,
        },
        {
          name: '开往',
          path: 'https://travellings.link/',
          newtab: true,
        },
      ],
    },
    custom: {
      script: '',
      style: '',
      js: [],
      css: [],
    },
  },
  function: {
    player: {
      id: [563534789, 1447327083, 1450252250],
    },
    analyze: {
      enable: false,
      ga: '',
      baidu: '',
      umami: {
        id: '',
        url: '',
      },
    },
    donate: {
      enable: false,
      link: 'https://afdian.net/@example',
      qrcode: [],
    },
    banDevtool: {
      enable: false,
    },
  },
}
