import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

const projectRoot = path.resolve(process.cwd())
const standaloneDir = path.join(projectRoot, '.next', 'standalone')

const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return
  fs.mkdirSync(to, { recursive: true })
  fs.cpSync(from, to, { recursive: true, force: true })
}

copyDir(path.join(projectRoot, '.next', 'static'), path.join(standaloneDir, '.next', 'static'))
copyDir(path.join(projectRoot, 'public'), path.join(standaloneDir, 'public'))

const port = process.env.PORT || '2323'
const env = { ...process.env, NODE_ENV: 'production', PORT: port }

const child = spawn('node', [path.join(standaloneDir, 'server.js')], {
  stdio: 'inherit',
  env,
  cwd: standaloneDir,
  shell: false,
})

child.on('exit', (code) => {
  process.exitCode = code || 0
})

