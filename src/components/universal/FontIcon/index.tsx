import type { FC } from 'react'
import { createElement, memo, useEffect } from 'react'

import {
  AkarIconsMention,
  CodiconGithubInverted,
  FaSolidCircle,
  FaSolidCircleNotch,
  FaSolidComment,
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidFeatherAlt,
  FaSolidHistory,
  FaSolidSubway,
  FaSolidUserFriends,
  IcBaselineLiveTv,
  IcBaselineTelegram,
  IcTwotoneSignpost,
  IconParkOutlineTencentQq,
  IonBook,
  JamRssFeed,
  MdiFlask,
  MdiTwitter,
  RiNeteaseCloudMusicLine,
} from '~/components/ui/Icons/menu-icon'

export const iconMap = {
  faBookOpen: IonBook,
  faCircleNotch: FaSolidCircleNotch,
  faComment: FaSolidComment,
  faComments: FaSolidComments,
  faFeatherAlt: FaSolidFeatherAlt,
  faGlasses: IcTwotoneSignpost,
  faHistory: FaSolidHistory,
  faMusic: RiNeteaseCloudMusicLine,
  faSubway: FaSolidSubway,
  faUserFriends: FaSolidUserFriends,
  faCircle: FaSolidCircle,
  faDotCircle: FaSolidDotCircle,
  faGithub: CodiconGithubInverted,
  faQq: IconParkOutlineTencentQq,
  faTwitter: MdiTwitter,
  faFlask: MdiFlask,
  faTv: IcBaselineLiveTv,
  faFeed: JamRssFeed,
  faMention: AkarIconsMention,
  faTelegram: IcBaselineTelegram,
}

let hasAppended = false
export const FontIcon: FC<{ icon?: JSX.Element | string }> = memo((props) => {
  useEffect(() => {
    if (typeof props.icon == 'string' && /^fa[sbldr]?\sfa-/.test(props.icon)) {
      if (hasAppended) {
        return
      }
      const $id = 'font-awesome-link'
      const $link = document.createElement('link')
      $link.href =
        'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/font-awesome/5.15.2/css/all.min.css'
      $link.rel = 'stylesheet'
      $link.id = $id

      document.head.appendChild($link)
      hasAppended = true
    }
  }, [props.icon])
  if (!props.icon) {
    return null
  }

  if (typeof props.icon === 'object') {
    return props.icon
  }
  return (
    <>
      {iconMap[props.icon] ? (
        createElement(iconMap[props.icon], { className: 'inline' })
      ) : (
        <i
          className={
            props.icon.startsWith('fa-') ? `fa ${props.icon}` : props.icon
          }
        />
      )}
    </>
  )
})
