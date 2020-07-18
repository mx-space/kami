/*
 * @Author: Innei
 * @Date: 2020-07-18 15:04:02
 * @LastEditTime: 2020-07-18 15:11:43
 * @LastEditors: Innei
 * @FilePath: /mx-web/version.js
 * @Coding with Love
 */

const gitlog = require('gitlog').default
const dayjs = require('dayjs')
const options = {
  repo: __dirname,
  number: 1,
}

const commits = gitlog(options)
const lastCommit = commits[0]
const { authorDate, abbrevHash } = lastCommit
module.exports = {
  version: `v${dayjs(authorDate).format('YYYYMMDDHHmmss')}`,
  hash: abbrevHash,
}
