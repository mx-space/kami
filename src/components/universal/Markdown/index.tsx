import { clsx } from 'clsx'
import range from 'lodash-es/range'
import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import type { ElementType, FC, RefObject } from 'react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import type { ReactMarkdownProps } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { ensuredForwardRef } from 'react-use'

import CustomRules from '~/components/universal/Markdown/rules'
import type { TocProps } from '~/components/widgets/Toc'
import { useStore } from '~/store'

import { CodeBlock } from '../CodeBlock'
import { BiListNested } from '../Icons/shared'
import { useModalStack } from '../Modal/stack.context'
import styles from './index.module.css'
import { processDetails } from './process-tag'
import {
  RenderCommentAt,
  RenderLink,
  RenderListItem,
  RenderParagraph,
  RenderReference,
  RenderSpoiler,
  RenderTableBody,
  RenderTableHead,
  RenderTableRow,
} from './renderers'
import { Heading } from './renderers/Heading'
import { Image } from './renderers/Image'

const Toc = dynamic(
  () => import('~/components/widgets/Toc').then((m) => m.Toc),
  {
    ssr: false,
  },
)
type MdProps = ReactMarkdownProps & {
  value?: string
  toc?: boolean
  [key: string]: any
  style?: React.CSSProperties
  readonly renderers?: { [nodeType: string]: ElementType }
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
  codeBlockFully?: boolean

  children?: string
}

const __Markdown: FC<MdProps> = ensuredForwardRef<HTMLDivElement, MdProps>(
  (props, ref) => {
    const {
      value,
      renderers,
      style,
      wrapperProps = {},
      codeBlockFully = false,
      ...rest
    } = props

    useEffect(() => {
      const _ = ref as RefObject<HTMLElement>
      if (!_.current) {
        return
      }
      const $ = _.current as HTMLElement
      //  process raw html tag
      processDetails($)
    }, [ref])

    const [headings, setHeadings] = useState<HTMLElement[]>([])

    useEffect(() => {
      const _ = ref as RefObject<HTMLElement>
      if (!_.current) {
        return
      }
      const $ = _.current
      // FIXME: 可能存在 memory leak

      setHeadings(
        Array.from(
          $.querySelectorAll(
            range(0, 6)
              .map((i) => `h${i}`)
              .join(', '),
          ),
        ),
      )
    }, [ref, value])

    return (
      <div
        id="write"
        style={style}
        {...wrapperProps}
        ref={ref}
        className={clsx(
          styles['md'],
          codeBlockFully ? styles['code-fully'] : undefined,
        )}
        suppressHydrationWarning
      >
        <ReactMarkdown
          source={value ?? (props.children as string)}
          // source={TestText}
          {...rest}
          renderers={useMemo(
            () => ({
              code: CodeBlock,
              pre: CodeBlock,
              image: Image,
              heading: Heading(),
              link: RenderLink,
              spoiler: RenderSpoiler,
              paragraph: RenderParagraph,
              commentAt: RenderCommentAt,
              linkReference: RenderReference,
              listItem: RenderListItem,
              tableHead: RenderTableHead,
              tableRow: RenderTableRow,
              tableBody: RenderTableBody,
              ...renderers,
            }),
            [renderers],
          )}
          plugins={CustomRules}
        />

        {props.toc && <TOC headings={headings} />}
      </div>
    )
  },
)

export const Markdown = memo(__Markdown)

export const TOC: FC<TocProps> = observer((props) => {
  const { appStore, actionStore } = useStore()
  const { isNarrowThanLaptop: isWiderThanLaptop } = appStore
  const { present } = useModalStack()
  useEffect(() => {
    if (!isWiderThanLaptop || props.headings.length == 0) {
      return
    }
    const id = Symbol('toc')
    actionStore.appendActions({
      icon: <BiListNested />,
      id,
      onClick() {
        present({
          component: <Toc useAsWeight {...props} />,
          modalProps: {
            title: 'Table of Content',
            noBlur: true,
          },
        })
      },
    })
    return () => {
      actionStore.removeActionBySymbol(id)
    }
  }, [actionStore, isWiderThanLaptop, present, props])
  return !isWiderThanLaptop ? <Toc {...props} /> : null
})
