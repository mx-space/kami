import type { MarkdownToJSX } from 'markdown-to-jsx'
import { Priority, blockRegex } from 'markdown-to-jsx'

import { Carousel } from '../../Carousel'

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
          <Carousel
            key={state?.key}
            images={content.split('\n').filter(Boolean)}
          />
        )
      case 'gallery': {
        return <div key={state?.key} />
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
