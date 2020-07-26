import CustomRules from 'common/markdown/rules'
import { useStore } from 'common/store'
import { ImageLazyWithPopup } from 'components/Image'
import Toc from 'components/Toc'
import { observer } from 'mobx-react'
import Router from 'next/router'
import React, {
  createElement,
  DOMAttributes,
  ElementType,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { ImageSizesContext } from '../../common/context/ImageSizes'
import CodeBlock from '../CodeBlock'
interface MdProps extends ReactMarkdownProps {
  value: string
  showTOC?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ElementType }
}

const Heading: () => FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6
  key?: number
}> = () => {
  let index = 0
  return function RenderHeading(props) {
    return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
      `h${props.level}`,
      {
        id: index++ + '¡' + (props.children?.[0].props.value as string),
      } as any,
      props.children,
    )
  }
}
const RenderLink: FC<{
  href: string
  key?: string
  children?: JSX.Element | JSX.Element[]
}> = (props) => {
  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const href = props.href
      const locateUrl = new URL(location.href)

      const toUrlParser = new URL(href)

      if (
        toUrlParser.host === locateUrl.host ||
        (process.env.NODE_ENV === 'development' &&
          toUrlParser.host === 'innei.ren')
      ) {
        e.preventDefault()
        const pathArr = toUrlParser.pathname.split('/').filter(Boolean)
        const headPath = pathArr[0]

        switch (headPath) {
          case 'posts': {
            Router.push('/posts/[category]/[slug]', toUrlParser.pathname)
            break
          }
          case 'notes': {
            Router.push('/notes/[id]', toUrlParser.pathname)
            break
          }
          case 'category': {
            Router.push('/category/[slug]', toUrlParser.pathname)
            break
          }
          default: {
            Router.push(toUrlParser.pathname)
          }
        }
      }
    },
    [props.href],
  )
  return (
    <>
      <a href={props.href} target={'_blank'} onClick={handleRedirect}>
        {props.children}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 100 100"
          width="15"
          height="15"
        >
          <path
            fill="var(--shizuku-text-color)"
            d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
          ></path>
          <polygon
            fill="var(--shizuku-text-color)"
            points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
          ></polygon>
        </svg>
      </a>
    </>
  )
}

export const calculateDimensions = (
  width: number,
  height: number,
  max: { width: number; height: number },
) => {
  const { height: maxHeight, width: maxWidth } = max
  const wRatio = maxWidth / width
  const hRatio = maxHeight / height
  let ratio = 1
  if (maxWidth == Infinity && maxHeight == Infinity) {
    ratio = 1
  } else if (maxWidth == Infinity) {
    if (hRatio < 1) ratio = hRatio
  } else if (maxHeight == Infinity) {
    if (wRatio < 1) ratio = wRatio
  } else if (wRatio < 1 || hRatio < 1) {
    ratio = wRatio <= hRatio ? wRatio : hRatio
  }
  if (ratio < 1) {
    return {
      width: width * ratio,
      height: height * ratio,
    }
  }
  return {
    width,
    height,
  }
}
// FIXME render problem
const getContainerSize = () => {
  return document.getElementById('write')?.getBoundingClientRect().width
}
const Image: () => FC<{ src: string; alt?: string }> = () => {
  let index = 0
  return observer(function RenderImage({ src, alt }) {
    const images = useContext(ImageSizesContext) || []
    const [cal, setCal] = useState({} as { height?: number; width?: number })
    const { appStore } = useStore()
    useEffect(() => {
      if (!appStore.loading) {
        const initImageSize = () => {
          const maxWidth = typeof document !== 'undefined' && getContainerSize()
          const size = images[index++] || {
            height: undefined,
            width: undefined,
          }
          const max = {
            width: (maxWidth ?? getContainerSize()) || 500,

            height: Infinity,
          }
          if (!(size.width && size.height)) {
            return
          }
          const cal = calculateDimensions(size.width, size.height, max)

          setCal(cal)
        }

        initImageSize()
      }
    }, [images, appStore.loading])

    if (typeof document === 'undefined') {
      return <img src={src} alt={alt} />
    }

    return (
      <ImageLazyWithPopup
        src={src}
        alt={alt}
        height={cal.height}
        width={cal.width}
        style={{ padding: '1rem 0' }}
      />
    )
  })
}

const RenderSpoiler: FC<{ value: string }> = (props) => {
  return (
    <span className={'spoiler'} title={'你知道的太多了'}>
      {props.value}
    </span>
  )
}

const RenderParagraph: FC<{}> = (props) => {
  return <div className={'paragraph'}>{props.children}</div>
}

const RenderCommentAt: FC<{ value: string }> = ({ value }) => {
  return <>@{value}</>
}
const Markdown: FC<MdProps> = observer((props) => {
  const { value, renderers, style, ...rest } = props
  const { appStore } = useStore()
  const { viewport } = appStore
  return (
    <div id="write" style={style}>
      <ReactMarkdown
        source={value}
        {...rest}
        renderers={{
          code: CodeBlock,
          pre: CodeBlock,
          image: Image(),
          heading: Heading(),
          link: RenderLink,
          spoiler: RenderSpoiler,
          paragraph: RenderParagraph,
          // eslint-disable-next-line react/display-name
          commentAt: RenderCommentAt,
          ...renderers,
        }}
        plugins={CustomRules}
      />
      {props.showTOC && !viewport.mobile && !viewport.pad ? <Toc /> : null}
    </div>
  )
})

export default Markdown
