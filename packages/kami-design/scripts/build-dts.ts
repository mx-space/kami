import fs from 'fs'
import { readFile, unlink, writeFile } from 'fs/promises'
import path from 'path'
import { $ } from 'zx'

const dir = 'dist'
const envDtsPath = path.resolve(
  import.meta.url.replace('file://', ''),
  '..',
  '..',
  'env.d.ts',
)

const componentsBase = './components'

const resolveComponentDir = (name) => path.resolve(componentsBase, name)

async function process(withWidi: boolean) {
  const tasks: Promise<any>[] = []

  // build dist root dts

  await $`npx dts-bundle-generator -o ${dir}/index.d.ts ./index.ts --no-check --silent --project ./tsconfig.types.json`.quiet()
  await $`cp dist/index.d.ts dist/index.windi.d.ts`

  // build components dts
  const componentsDir = fs
    .readdirSync(componentsBase)
    .filter(
      (name) =>
        name != 'index.ts' &&
        fs.statSync(resolveComponentDir(name)).isDirectory(),
    )

  for (const componentName of componentsDir) {
    const componentEntryFile = path.resolve(
      componentsBase,
      componentName,
      'index.tsx',
    )
    const hasTsxEntry = fs.existsSync(componentEntryFile)

    let input = ''

    if (hasTsxEntry) {
      input = componentEntryFile
    } else {
      input = path.resolve(componentsBase, componentName, 'index.ts')
    }
    const content = await readFile(input, {
      encoding: 'utf-8',
    })
    const appendLines = [`/// <reference path="${envDtsPath}" />`]

    if (withWidi) {
      appendLines.push(`import 'virtual:windi.css'`)
    }

    const newContent = `${appendLines.join('\n')}\n${content}`

    const tempInput = `${input}.temp.tsx`
    await unlink(tempInput).catch(() => {})
    tasks.push(
      writeFile(tempInput, newContent, {
        encoding: 'utf-8',
        flag: 'w',
      }).then(async () => {
        await $`npx dts-bundle-generator -o ${dir}/components/${componentName}/index.d.ts ${tempInput} --no-check --silent --project ./tsconfig.types.json`.quiet()
        await $`cp dist/components/${componentName}/index.d.ts dist/components/${componentName}/index.windi.d.ts`
        await unlink(tempInput).catch(() => {})
      }),
    )
  }

  return Promise.all(tasks)
}

async function main() {
  await process(false)
  await process(true)
}

main()
