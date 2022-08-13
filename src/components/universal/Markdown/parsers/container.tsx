import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority, blockRegex } from 'markdown-to-jsx'

import { Carousel } from '../components/carousel'
import { Gallery } from '../components/gallery'
import { pickImagesFromMarkdown } from '../utils/image'

const shouldCatchContainerName = ['carousel', 'gallery'].join('|')
export const ContainerRule: MarkdownToJSX.Rule = {
  match: blockRegex(
    new RegExp(
      `^\\s*::: *(?<name>(${shouldCatchContainerName}))? *\n(?<content>[\\s\\S]+?)\\s*::: *(?:\n *)+\n?`,
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
    const { name, content } = node

    switch (name) {
      case 'carousel':
        return (
          <Carousel key={state?.key} images={pickImagesFromMarkdown(content)} />
        )
      case 'gallery': {
        return (
          <Gallery key={state?.key} images={pickImagesFromMarkdown(content)} />
        )
      }
    }

    return null
  },
}

/**
 * carousel container
 *
 * ::: carousel
 * ![name](url)
 * ![name](url)
 * ![name](url)
 * :::
 */
