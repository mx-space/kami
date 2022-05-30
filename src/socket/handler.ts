import { runInAction } from 'mobx'
import { message } from 'react-message-popup'
import { isDev } from 'utils'

import { EventTypes } from '~/types/events'

import { store } from '../store'
import { createDangmaku } from '../utils/danmaku'
import { Notice } from '../utils/notice'

export const notice = Notice.shared

export const eventHandler = (type: EventTypes, data: any) => {
  const title = window.data?.aggregateData.seo.title || 'Kami'
  const webUrl =
    window.data?.aggregateData.url.webUrl.replace(/\/$/, '') ||
    globalThis?.location.host ||
    ''

  const { gatewayStore, noteStore, postStore, userStore, pageStore } = store
  switch (type) {
    case EventTypes.VISITOR_ONLINE:
    case EventTypes.VISITOR_OFFLINE: {
      const { online } = data
      runInAction(() => {
        gatewayStore.online = online
      })
      break
    }
    case EventTypes.RECENTLY_CREATE: {
      notice.notice({
        title,
        text: '站长发布一条新动态',
        description: data.content,
        onclick: () => {
          window.open(`${webUrl}/recently`)
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
        title,
        text: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open(
            webUrl +
              (_type[type] === 'post'
                ? `/posts/${data.category.slug}/${data.slug}`
                : `/notes/${data.nid}`),
          )
        },
      })

      break
    }
    case EventTypes.SAY_CREATE: {
      store.sayStore.add(data)
      const message = noticeHead('说说')
      notice.notice({
        title,
        text: message,
        description: getDescription(data.text),
        onclick: () => {
          window.open(`${webUrl}/says`)
        },
      })

      break
    }
    case EventTypes.SAY_DELETE: {
      const id = data
      store.sayStore.remove(id)
      break
    }
    case EventTypes.COMMENT_CREATE: {
      store.commentStore.addComment(data)
      break
    }
    case EventTypes.DANMAKU_CREATE: {
      createDangmaku({
        text: `${data.author}: ${data.text}`,
        color: data.color,
      })

      if (
        (data.author == userStore.name || data.author == userStore.username) &&
        !userStore.isLogged
      ) {
        notice.notice({
          title: `${userStore.name} 敲了你一下`,
          text: data.text,
          options: { image: userStore.master?.avatar },
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
      const id = data
      postStore.softDelete(id)
      break
    }
    case EventTypes.NOTE_UPDATE: {
      runInAction(() => {
        noteStore.addAndPatch(data)
        const note = noteStore.get(data.id)
        if (note) {
          if (note.hide && !store.userStore.isLogged) {
            note.title = '已隐藏'
            note.text = '该笔记已被隐藏'
          }
        }
      })
      break
    }
    case EventTypes.NOTE_DELETE: {
      const id = data
      runInAction(() => {
        noteStore.softDelete(id)
        const note = noteStore.get(id)
        if (note) {
          note.title = '已删除'
          note.text = '该笔记已被删除'
        }
      })
      break
    }

    case EventTypes.PAGE_UPDATED: {
      message.info('页面内容已更新')
      pageStore.addAndPatch(data)
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
  return `${store.userStore.name}发布了新的${type}${title ? `: ${title}` : ''}`
}
function getDescription(text: string) {
  return text.length > 20 ? `${text.slice(0, 20)}...` : text
}
