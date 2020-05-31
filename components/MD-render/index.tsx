import { ImageLazyWithPopup } from 'components/Image'
import Toc from 'components/Toc'
import { observer } from 'mobx-react'
import Router from 'next/router'
import React, {
  createElement,
  DOMAttributes,
  FC,
  memo,
  ReactType,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import ReactMarkdown, { ReactMarkdownProps } from 'react-markdown'
import { useStore } from 'store'
import CodeBlock from '../CodeBlock'
import { imageSizesContext } from '../../context/ImageSizes'

interface MdProps extends ReactMarkdownProps {
  value: string
  showTOC?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ReactType }
}

const Heading: FC<{ level: 1 | 2 | 3 | 4 | 5 | 6; key?: number }> = (props) => {
  return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
    `h${props.level}`,
    { id: props.children?.[0].props.value } as any,
    props.children,
  )
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

      if (toUrlParser.host === locateUrl.host) {
        e.preventDefault()
        const pathArr = toUrlParser.pathname.split('/').filter(Boolean)
        const headPath = pathArr[0]

        switch (headPath) {
          case 'posts': {
            Router.push('/posts/[category]/[slug]', toUrlParser.pathname)
            break
          }
          case 'notes': {
            console.log(toUrlParser.pathname)

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

        return false
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

const calculateDimensions = (width?: number, height?: number) => {
  if (!width || !height) {
    return { height: 300, width: undefined }
  }
  const MAX = {
    width: document.getElementById('write')?.offsetWidth || 500,
    height: 2000,
  }
  let dimensions = { width, height }
  if (width > height) {
    if (width > MAX.width) {
      dimensions.width = MAX.width
      dimensions.height = (MAX.width / width) * height
    }
  } else {
    if (height > MAX.height) {
      dimensions.height = MAX.height
      dimensions.width = (MAX.height / height) * width
    }
  }
  return dimensions
}

const RenderImage: FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const images = useContext(imageSizesContext)
  const [cal, setCal] = useState({} as { height?: number; width?: number })
  useEffect(() => {
    const size = images.shift()
    const cal = calculateDimensions(size?.width, size?.height)
    setCal(cal)
  }, [images])
  if (typeof document === 'undefined') {
    return null
  }

  console.log(cal)
  return (
    <ImageLazyWithPopup
      src={src}
      alt={alt}
      height={cal.height}
      width={cal.width}
    />
  )
}
const Markdown: FC<MdProps> = observer((props) => {
  const { value, renderers, style, ...rest } = props
  const { appStore } = useStore()
  const { viewport } = appStore
  return (
    <>
      <div id="write" style={style}>
        <ReactMarkdown
          source={value}
          {...rest}
          renderers={{
            code: CodeBlock,
            pre: CodeBlock,
            image: RenderImage,
            heading: Heading,
            link: RenderLink,
            ...renderers,
          }}
        />
        {props.showTOC && !viewport.mobile && !viewport.pad ? <Toc /> : null}
      </div>
    </>
  )
})

export default memo(Markdown)
