import { IconDefinition } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FC, useEffect } from 'react'

let hasAppended = false
export const FontIcon: FC<{ icon?: IconDefinition | string }> = (props) => {
  useEffect(() => {
    if (typeof props.icon == 'string') {
      if (hasAppended) {
        return
      }
      const $id = 'font-awesome-link'
      const $link = document.createElement('link')
      $link.href =
        'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.3/css/all.min.css'
      $link.rel = 'stylesheet'
      $link.id = $id

      document.head.appendChild($link)
      hasAppended = true
    }
  }, [props.icon])
  if (!props.icon) {
    return null
  }
  return (
    <>
      {isFontAwesomeIconDefine(props.icon) ? (
        <FontAwesomeIcon icon={props.icon!} />
      ) : (
        <i className={'fa ' + props.icon} />
      )}
    </>
  )
}

function isFontAwesomeIconDefine(icon): icon is IconDefinition {
  return (
    typeof icon === 'object' &&
    icon &&
    icon.icon &&
    icon.prefix &&
    icon.iconName
  )
}
