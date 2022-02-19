import { createElement, FC, memo, useEffect } from 'react'
import { CodiconGithubInverted } from '../Icons'
import {
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
  IconParkOutlineTencentQq,
  IcTwotoneSignpost,
  IonBook,
  MdiFlask,
  MdiTwitter,
  RiNeteaseCloudMusicLine,
} from '../Icons/menu-icon'

export const fontawesomeIconMap = {
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
      {fontawesomeIconMap[props.icon] ? (
        createElement(fontawesomeIconMap[props.icon], { className: 'inline' })
      ) : (
        <i
          className={
            props.icon.startsWith('fa-') ? 'fa ' + props.icon : props.icon
          }
        />
      )}
    </>
  )
})
