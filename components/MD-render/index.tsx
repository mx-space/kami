import CustomRules from 'common/markdown/rules'
import { useStore } from 'common/store'
import { ImageLazyWithPopup } from 'components/Image'
import Toc from 'components/Toc'
import { observer } from 'mobx-react'
import Router from 'next/router'
import React, {
  createElement,
  DOMAttributes,
  FC,
  ReactType,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { imageSizesContext } from '../../common/context/ImageSizes'
import CodeBlock from '../CodeBlock'
interface MdProps extends ReactMarkdownProps {
  value: string
  showTOC?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ReactType }
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

const calculateDimensions = (
  width?: number,
  height?: number,
  max?: { width: number; height: number },
) => {
  if (!width || !height) {
    return { height: undefined, width: undefined }
  }
  const MAX = max ?? {
    width: 500, // 容器的宽度
    height: Infinity, // 可选最大高度
  }
  const dimensions = { width, height }
  if (width > height && width > MAX.width) {
    dimensions.width = MAX.width
    dimensions.height = (MAX.width / width) * height
  } else if (height === width) {
    if (width <= MAX.width) {
      dimensions.height = dimensions.width = height
    } else {
      dimensions.height = MAX.width
      dimensions.width = dimensions.height
    }
  }
  return dimensions
}
// FIXME render problem
const getContainerSize = () => {
  const $0 = document.getElementById('article-wrap')
  const computedStyle = getComputedStyle($0!)!
  let elementWidth = $0!.clientWidth
  elementWidth -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight)
  return elementWidth
}
const Image: () => FC<{ src: string; alt?: string }> = () => {
  let index = 0
  return function RenderImage({ src, alt }) {
    const images = useContext(imageSizesContext)
    const [cal, setCal] = useState({} as { height?: number; width?: number })
    const maxWidth = typeof document !== 'undefined' && getContainerSize()

    useEffect(() => {
      const size = images[index++] || { height: undefined, width: undefined }
      const max = {
        width: (maxWidth ?? getContainerSize()) || 500,
        // width: 10000,
        height: Infinity,
      }
      const cal = calculateDimensions(size?.width, size?.height, max)

      setCal(cal)
    }, [images, maxWidth])

    if (typeof document === 'undefined') {
      return null
    }

    return (
      <ImageLazyWithPopup
        src={src}
        alt={alt}
        height={cal.height}
        width={cal.width}
      />
    )
  }
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
          ...renderers,
        }}
        plugins={CustomRules}
      />
      {props.showTOC && !viewport.mobile && !viewport.pad ? <Toc /> : null}
    </div>
  )
})

export default Markdown
