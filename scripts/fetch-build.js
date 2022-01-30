// @ts-check
const { $, cd, fetch } = require('zx')
const fs = require('fs')
const { sleep } = require('zx')
const { homedir } = require('os')
const path = require('path')
const { nothrow } = require('zx')

const owner = 'mx-space'
const repo = 'kami'

async function main() {
  cd(path.resolve(homedir(), 'mx/kami'))
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
  )
  const data = await res.json()
  const downloadUrl = data.assets.find(
    (asset) =>
      asset.name === 'release-ubuntu.zip' || asset.name === 'release.zip',
  )?.browser_download_url

  if (!downloadUrl) {
    throw new Error('no download url')
  }

  const buffer = await fetch(
    'https://small-lake-9960.tukon479.workers.dev/' + downloadUrl,
  ).then((res) => res.buffer())
  const tmpName = (Math.random() * 10).toString(16)
  fs.writeFileSync(`/tmp/${tmpName}.zip`, buffer, { flag: 'w' })
  // pwd: ~/mx/kami
  await $`git checkout master`
  await $`git branch --set-upstream-to=origin/master master`
  await $`git pull`
  await $`pnpm i`
  await $`rm -rf ./.next`
  await $`unzip /tmp/${tmpName}.zip -d ./.next`
  await $`rm /tmp/${tmpName}.zip`
  // standalone is not stable, temporally disable
  // await nothrow($`pm2 reload ecosystem.standalone.config.js --update-env`)
  await nothrow($`pm2 reload ecosystem.config.js --update-env`)
  console.log('等待 15 秒')
  await sleep(15000)
  try {
    await $`lsof -i:2323 -P -n | grep LISTEN`
  } catch {
    await $`pm2 stop ecosystem.config.js`
    throw new Error('server is not running')
  }
}

main()
