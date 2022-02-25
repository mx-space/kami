import clsx from 'clsx'
import { EmptyIcon, IonSearch } from 'components/universal/Icons'
import { OverLay, OverlayProps } from 'components/universal/Overlay'
import { MaidianAction } from 'constants/maidian'
import { useAnalyze } from 'hooks/use-analyze'
import { useHotKey } from 'hooks/use-hotkey'
import { throttle } from 'lodash-es'
import Link from 'next/link'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { useStore } from 'store'
import { apiClient } from 'utils'
import styles from './index.module.css'

export type SearchPanelProps = {
  defaultKeyword?: string
}

type SearchListType = {
  title: string
  subtitle?: string
  url: string
  id: string
}
let lastResponse = [+new Date(), null] as [number, any]
const search = throttle((keyword: string) => {
  return new Promise<Awaited<
    ReturnType<typeof apiClient.search.searchByAlgolia>
  > | null>((resolve, reject) => {
    const date = +new Date()
    if (!keyword) {
      lastResponse = [date, null]
      resolve(null)
      return
    }
    apiClient.search
      .searchByAlgolia(keyword)
      .then((data) => {
        // 只给最后一个请求返回结果
        if (date > lastResponse[0]) {
          lastResponse = [date, data]
        }
        resolve(lastResponse[1])
      })
      .catch((err) => {
        reject(err)
      })
  })
}, 1000)

export const SearchPanel: FC<SearchPanelProps> = memo((props) => {
  const { defaultKeyword } = props
  const [keyword, setKeyword] = useState(defaultKeyword || '')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<SearchListType[]>([])
  const { event } = useAnalyze()
  useEffect(() => {
    setLoading(true)

    search(keyword)
      ?.then((res) => {
        event({
          action: MaidianAction.Search,
          label: keyword,
        })
        if (!res) {
          setLoading(false)
          setList([])
          return
        }
        const data = res.data
        if (!data) {
          setLoading(false)
          return
        }
        const _list: SearchListType[] = data.map((item) => {
          switch (item.type) {
            case 'post':
              return {
                title: item.title,
                subtitle: item.category.name,
                id: item.id,
                url: '/posts/' + item.category.slug + '/' + item.slug,
              }
            case 'note':
              return {
                title: item.title,
                subtitle: '生活记录',
                id: item.id,
                url: '/notes/' + item.nid,
              }
            case 'page':
              return {
                title: item.title,
                subtitle: '页面',
                id: item.id,
                url: '/pages/' + item.slug,
              }
          }
        })

        setList(_list)

        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }, [keyword])

  return (
    <div
      className="w-[800px] max-w-[80vw] max-h-[60vh] h-[600px] 
    bg-bg-opacity backdrop-filter backdrop-blur-lg backdrop-brightness-125
    shadow-lg
    min-h-50 rounded-xl flex flex-col overflow-hidden text-[--black]"
    >
      <input
        autoFocus
        className="p-4 px-5 w-full text-[16px] leading-4 bg-transparent"
        placeholder="Search..."
        defaultValue={defaultKeyword}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div
        className={clsx(styles['status-bar'], loading && styles['loading'])}
      ></div>
      <div className="flex-grow flex-shrink relative overflow-overlay">
        <ul className="py-4 px-3 h-full">
          {list.length === 0 && !loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <EmptyIcon />
                <span>无内容</span>
              </div>
            </div>
          ) : (
            list.map((item) => {
              return (
                <li key={item.id}>
                  <Link href={item.url}>
                    <a className={styles['item']}>
                      <span className="block flex-1 flex-shrink-0 truncate">
                        {item.title}
                      </span>
                      <span className="text-gray-2 block text-deepgray flex-grow-0 flex-shrink-0">
                        {item.subtitle}
                      </span>
                    </a>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
})
export const SearchOverlay: FC<OverlayProps> = (props) => {
  const { ...rest } = props

  useHotKey({ key: 'Escape', preventInput: false }, () => {
    props.onClose()
  })
  return (
    <OverLay childrenOutside center {...rest}>
      <SearchPanel />
    </OverLay>
  )
}

export const SearchHotKey: FC = memo(() => {
  const { event } = useAnalyze()
  const [show, setShow] = useState(false)
  const handler = () => {
    event({ action: MaidianAction.CommandKTap, label: 'cmd+k' })
    setShow(true)
  }

  useHotKey({ key: 'k', modifier: ['Meta'], preventInput: false }, handler)
  useHotKey({ key: 'k', modifier: ['Control'], preventInput: false }, handler)

  useHotKey({ key: '/', preventInput: true }, handler)
  return <SearchOverlay show={show} onClose={() => setShow(false)} />
})

export const SearchFAB = memo(() => {
  const [show, setShow] = useState(false)
  const { actionStore } = useStore()
  const idSymbol = useRef(Symbol())
  const { event } = useAnalyze()
  useEffect(() => {
    if (show) {
      event({
        action: MaidianAction.SearchFAB,
      })
    }
  }, [show])
  useEffect(() => {
    actionStore.removeActionBySymbol(idSymbol.current)
    const action = {
      icon: <IonSearch />,
      id: idSymbol.current,
      onClick: () => {
        setShow(true)
      },
    }
    requestAnimationFrame(() => {
      actionStore.appendActions(action)
    })

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      actionStore.removeActionBySymbol(idSymbol.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <SearchOverlay show={show} onClose={() => setShow(false)} />
})
