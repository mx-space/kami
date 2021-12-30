// sync with config.init.yaml
export const defaultConfigs = {
  name: 'kami',
  site: {
    favicon: 'https://innei.ren/favicon.svg',
    logo_svg: 'https://innei.ren/favicon.svg',
    figure: [
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/qsNmnC2zHB5FW41.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/GwJzq4SYtClRcZh.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/6nOYcygRGXvpsFd.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/Qr2ykmsEFpJn4BC.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/KiOuTlCzge7JHh3.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/sM2XCJTW8BdUe5i.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/18KQYP9fNGbrzJu.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/rdjZo6Sg2JReyiA.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/X2MVRDe1tyJil3O.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/EDoKvz5p7BXZ46U.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/EGk4qUvcXDygV2z.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/5QdwFC82gT3XPSZ.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/KPyTCARHBzpxJ46.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/7TOEIPwGrZB1qFb.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/Ihj5QAZgVMqr9fJ.jpg',
      'https://cdn.jsdelivr.net/gh/Innei/fancy@master/2021/KZ6jv8C92Vpwcih.jpg',
    ],
    background: {
      src: {
        light:
          'https://gitee.com/xun7788/my-imagination/raw/master/cdn/background.png',
        dark: 'https://gitee.com/xun7788/my-imagination/raw/master/cdn/background-night.png',
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
          path: '/notes',
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
          ],
        },
        {
          title: '',
          icon: 'faSubway',
          path: 'https://travellings.link',
        },
      ],
    },
    social: [
      {
        url: 'https://github.com/Innei',
        title: 'GitHub',
        icon: 'faGithub',
        color: 'var(--black)',
      },
      {
        url: 'https://jq.qq.com/?_wv=1027&k=5t9N0mw',
        title: 'QQ',
        icon: 'faQq',
        color: '#12b7f5',
      },
      {
        url: 'https://twitter.com/__oQuery',
        title: 'twitter',
        icon: 'faTwitter',
        color: '#02A4ED',
      },
    ],
    footer: {
      background: {
        src: {
          dark: '',
          light:
            'https://gitee.com/xun7788/my-imagination/raw/master/cdn/footer.png',
        },
        position: 'top/cover',
      },
      home_page: 'https://innei.ren',
      motto: {
        content: 'Stay hungry. Stay foolish.',
        author: 'Steve Jobs',
      },
      icp: {
        enable: true,
        label: '浙ICP备 20028356 号',
        link: 'http://beian.miit.gov.cn/',
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
      script: "console.log('Hello')",
      css: '.foo {\n  color: red\n}',
      js: [
        'https://cdn.jsdelivr.net/npm/smooth-scroll@16.1.3/dist/smooth-scroll.min.js',
      ],
    },
  },
  function: {
    analyze: {
      enable: true,
      ga: 'G-X4PVVRB6TF',
    },
    netease: {
      username: 'example',
      password: null,
    },
    travellings: {
      enable: true,
    },
    donate: {
      enable: true,
      link: 'https://afdian.net/@Innei',
    },
  },
}
