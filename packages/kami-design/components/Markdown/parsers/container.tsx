import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority, blockRegex } from 'markdown-to-jsx'

import { Banner } from '../../Banner'
import { Gallery } from '../components/gallery'
import { pickImagesFromMarkdown } from '../utils/image'

const shouldCatchContainerName = ['gallery', 'banner', 'carousel'].join('|')
export const ContainerRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(
      `^\\s*::: *(?<name>(${shouldCatchContainerName})) *({(?<params>(.*?))})? *\n(?<content>[\\s\\S]+?)\\s*::: *(?:\n *)+\n?`,
    ),
  ),
  order: Priority.MED,
  parse(capture) {
    const { groups } = capture
    return {
      ...groups,
    }
  },
  // @ts-ignore
  react(node, _, state) {
    const { name, content, params } = node

    switch (name) {
      case 'carousel':
      case 'gallery': {
        return (
          <Gallery key={state?.key} images={pickImagesFromMarkdown(content)} />
        )
      }
      case 'banner': {
        if (!params) {
          break
        }

        return (
          <Banner
            type={params}
            className="my-4"
            message={content}
            key={state?.key}
          />
        )
      }
    }

    return (
      <div key={state?.key}>
        <p>{content}</p>
      </div>
    )
  },
}

/**
 * gallery container
 *
 * ::: gallery
 * ![name](url)
 * ![name](url)
 * ![name](url)
 * :::
 */
