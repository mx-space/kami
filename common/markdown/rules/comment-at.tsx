/*
 * @Author: Innei
 * @Date: 2020-06-11 13:01:08
 * @LastEditTime: 2020-07-21 17:15:16
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/markdown/rules/comment-at.tsx
 * @Coding with Love
 */
import type { Parser, Eat } from 'remark-parse'
import type { Node } from 'unist'
import isMongoId from 'validator/lib/isMongoId'
/**
 * parse (@username) to github user profile
 */
// @ts-ignore
function tokenizeMention(eat: Eat, value: string): Node | void
function tokenizeMention(eat: Eat, value: string, silent: true): boolean | void
function tokenizeMention(eat: Eat, value: string, silent?: boolean): any {
  const match = /^@(.*?)\s/i.exec(value)

  if (match && isMongoId(match[1])) {
    if (silent) {
      return true
    }
    try {
      return eat(match[0])({
        type: 'commentAt',
        value: match[1],
      })
      // eslint-disable-next-line no-empty
    } catch {}
  }
}
tokenizeMention.notInLink = true
tokenizeMention.locator = locateMention
function locateMention(value, fromIndex) {
  return value.indexOf('@', fromIndex)
}
function mentions(this: any) {
  const Parser = this.Parser as { prototype: Parser }
  const tokenizers = Parser.prototype.inlineTokenizers
  const methods = Parser.prototype.inlineMethods

  // Add an inline tokenizer (defined in the following example).
  tokenizers.commentAt = tokenizeMention

  // Run it just before `text`.
  methods.splice(methods.indexOf('text'), 0, 'commentAt')
}
export { mentions as commentAt }
