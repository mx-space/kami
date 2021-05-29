/*
 * @Author: Innei
 * @Date: 2021-05-29 19:03:22
 * @LastEditTime: 2021-05-29 19:16:58
 * @LastEditors: Innei
 * @FilePath: /web/rename.js
 * Mark: Coding with Love
 */

const { readdirSync, statSync, renameSync } = require('fs')
const { resolve } = require('path')

function rename(path = __dirname + '/components') {
  const tree = readdirSync(path)

  for (const file of tree) {
    const stat = statSync(resolve(path, file))

    if (stat.isDirectory()) {
      rename(resolve(path, file))
    }
    if (file.endsWith('.module.scss') || file.endsWith('.scss')) {
      renameSync(
        resolve(path, file),
        resolve(path, file.replace('scss', 'css')),
      )
    }
  }
}
rename(__dirname + '/components')
rename(__dirname + '/pages')
rename(__dirname + '/assets')
