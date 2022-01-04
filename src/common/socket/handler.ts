import { isDev } from 'utils'
import { createDangmaku } from '../../utils/danmaku'
import { Notice } from '../../utils/notice'
import { gatewayStore, noteStore, postStore, userStore } from '../store'
import { EventTypes } from './types'

export const notice = Notice.shared

export const eventHandler = (type: EventTypes, data: any) => {
  const title = window.data?.aggregateData.seo.title || 'Kami'
  const webUrl =
    window.data?.aggregateData.url.webUrl.replace(/\/$/, '') ||
    globalThis?.location.host ||
    ''
  switch (type) {
    case EventTypes.VISITOR_ONLINE:
    case EventTypes.VISITOR_OFFLINE: {
      const { online } = data
      gatewayStore.online = online
      break
    }
    case EventTypes.RECENTLY_CREATE: {
      notice.notice({
        title,
        body: '站长发布一条新动态',
        description: data.content,
        onclick: () => {
          window.open(webUrl + '/recently')
        },
      })
      break
    }
    case EventTypes.POST_CREATE:
    case EventTypes.NOTE_CREATE: {
      if (data.hide) {
        break
      }
      const message = noticeHead('文章', data.title)
      const _type: Record<
        EventTypes.POST_CREATE | EventTypes.NOTE_CREATE,
        string
      > = {
        [EventTypes.POST_CREATE]: 'post',
        [EventTypes.NOTE_CREATE]: 'note',
      }
      notice.notice({
        title: title,
        body: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open(
            webUrl +
              (_type[type] === 'post'
                ? '/posts/' + data.category.slug + '/' + data.slug
                : '/notes/' + data.nid),
          )
        },
      })

      break
    }
    case EventTypes.SAY_CREATE: {
      const message = noticeHead('说说')
      notice.notice({
        title: title,
        body: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open(webUrl + '/says')
        },
      })

      break
    }
    case EventTypes.DANMAKU_CREATE: {
      createDangmaku({
        text: data.author + ': ' + data.text,
        color: data.color,
      })

      if (
        (data.author == userStore.name || data.author == userStore.username) &&
        !userStore.isLogged
      ) {
        notice.notice({
          title: userStore.name + ' 敲了你一下',
          body: data.text,
          options: { image: userStore.master.avatar },
        })
      }

      break
    }
    // handle update event
    case EventTypes.POST_UPDATE: {
      postStore.addAndPatch(data)
      break
    }
    case EventTypes.POST_DELETE: {
      postStore.softDelete(data.id)
      break
    }
    case EventTypes.NOTE_UPDATE: {
      noteStore.addAndPatch(data)
      break
    }
    case EventTypes.NOTE_DELETE: {
      noteStore.softDelete(data.id)
      break
    }
    default: {
      if (isDev) {
        console.log(type, data)
      }
    }
  }
}
function noticeHead(type: string, title?: string) {
  return `${userStore.name}发布了新的${type}${title ? ': ' + title : ''}`
}
function getDescription(text: string) {
  return text.slice(0, 20) + '...'
}
