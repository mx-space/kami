import fs from 'fs'
import path from 'path'

const components = fs
  .readdirSync(path.resolve(process.cwd(), 'components'))
  .filter((name) => name !== 'index.ts')

for (const component of components) {
  const files = fs.readdirSync(
    path.resolve(process.cwd(), 'components', component),
  )

  for (const file of files) {
    if (!file.endsWith('.tsx')) {
      continue
    }
    const filePath = path.resolve(process.cwd(), 'components', component, file)
    const content = fs.readFileSync(filePath)
    if (content.includes('import React')) {
      continue
    }
    fs.writeFileSync(filePath, `import React from 'react'\n\n${content}`)
  }
}
