import { produce } from 'immer'
import { message } from 'react-message-popup'

import { useAppStore } from '~/atoms/app'
import { useCommentCollection } from '~/atoms/collections/comment'
import { useNoteCollection } from '~/atoms/collections/note'
import { usePageCollection } from '~/atoms/collections/page'
import { usePostCollection } from '~/atoms/collections/post'
import { useSayCollection } from '~/atoms/collections/say'
import { useUserStore } from '~/atoms/user'
import { EventTypes } from '~/types/events'
import { createDangmaku } from '~/utils/danmaku'
import { isDev } from '~/utils/env'
import { Notice } from '~/utils/notice'

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
      useAppStore.setState({
        gatewayOnline: online,
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
      useSayCollection.getState().add(data)
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
      useSayCollection.getState().remove(id)
      break
    }
    case EventTypes.COMMENT_CREATE: {
      useCommentCollection.getState().addComment(data)
      break
    }
    case EventTypes.DANMAKU_CREATE: {
      createDangmaku({
        text: `${data.author}: ${data.text}`,
        color: data.color,
      })

      const userStore = useUserStore.getState()

      if (
        (data.author == userStore.master?.name ||
          data.author == userStore.master?.username) &&
        !userStore.isLogged
      ) {
        notice.notice({
          title: `${userStore.master?.name} 敲了你一下`,
          text: data.text,
          options: { image: userStore.master?.avatar },
        })
      }

      break
    }
    // handle update event
    case EventTypes.POST_UPDATE: {
      usePostCollection.getState().addOrPatch(data)
      break
    }
    case EventTypes.POST_DELETE: {
      const id = data
      usePostCollection.getState().softDelete(id)
      break
    }
    case EventTypes.NOTE_UPDATE: {
      const noteCollection = useNoteCollection.getState()
      noteCollection.addOrPatch(data)
      useNoteCollection.setState(
        produce((state: ReturnType<typeof useNoteCollection.getState>) => {
          const note = state.get(data.id)
          if (note) {
            const noteWithHide = note as typeof note & { hide?: boolean }
            if (noteWithHide.hide && !useUserStore.getState().isLogged) {
              noteWithHide.title = '已隐藏'
              noteWithHide.text = '该笔记已被隐藏'
            }
          }
        }),
      )

      break
    }
    case EventTypes.NOTE_DELETE: {
      const id = data

      useNoteCollection.getState().softDelete(id)

      useNoteCollection.setState(
        produce((state: ReturnType<typeof useNoteCollection.getState>) => {
          const note = state.get(id)
          if (note) {
            note.title = '已删除'
            note.text = '该笔记已被删除'
          }
        }),
      )

      break
    }

    case EventTypes.PAGE_UPDATED: {
      message.info('页面内容已更新')
      usePageCollection.getState().addOrPatch(data)
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
  return `${useUserStore.getState().master?.name}发布了新的${type}${
    title ? `: ${title}` : ''
  }`
}
function getDescription(text: string) {
  return text.length > 20 ? `${text.slice(0, 20)}...` : text
}
