// @ts-check

import fs from 'fs'
import path from 'path'
import esbuild, { minify } from 'rollup-plugin-esbuild'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import css from 'rollup-plugin-postcss'
import { default as WindiCSS } from 'rollup-plugin-windicss'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const packageJson = JSON.parse(
  fs.readFileSync('./package.json', {
    encoding: 'utf-8',
  }),
)
const globals = {
  // @ts-ignore
  ...(packageJson?.dependencies || {}),
}

const dir = 'dist'
const external = ['react', 'react-dom', /^lodash/, ...Object.keys(globals)]

const plugins = [
  ...WindiCSS({}),
  nodeResolve(),
  commonjs({
    include: 'node_modules/**',
  }),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
    sourceMap: false,
  }),
  css({}),

  // @ts-ignore
  peerDepsExternal(),

  esbuild({
    include: /\.[jt]sx?$/,
    exclude: /node_modules/,
    sourceMap: false,
    minify: process.env.NODE_ENV === 'production',
    target: 'es2017',
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',

    tsconfig: 'tsconfig.json',

    loaders: {
      '.json': 'json',

      '.js': 'jsx',
    },
  }),

  {
    name: 'replace-env',
    transform(code) {
      return {
        code: code.replace(`process.env.NODE_ENV === "development"`, false),
      }
    },
  },
]

const __dirname = path.resolve(import.meta.url.replace('file://', ''), '..')
const envDtsPath = path.resolve(__dirname, 'env.d.ts')
/**
 *
 * @param {boolean} withWidi
 * @returns {import('rollup').RollupOptions[]}
 */
const buildComponentsConfig = (withWidi) => {
  const componentsBase = './components'
  const resolveComponentDir = (name) => path.resolve(componentsBase, name)
  const componentsDir = fs
    .readdirSync(componentsBase)
    .filter(
      (name) =>
        name != 'index.ts' &&
        fs.statSync(resolveComponentDir(name)).isDirectory(),
    )

  const configs = []

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
    const content = fs.readFileSync(input, 'utf-8')
    const appendLines = [`/// <reference path="${envDtsPath}" />`]

    if (withWidi) {
      appendLines.push(`import 'virtual:windi.css'`)
    }

    const newContent = `${appendLines.join('\n')}\n${content}`

    configs.push({
      input,
      external,
      output: [
        {
          file: `${dir}/components/${componentName}/index${
            withWidi ? '.windi' : ''
          }.js`,
          format: 'esm',
          sourcemap: false,
        },
      ],

      plugins: [
        {
          name: 'temp',
          load: (id) => {
            if (id === input) {
              return newContent
            }
          },
        },

        ...plugins,
      ],

      treeshake: true,
    })
  }

  return configs
}

/**
 *
 * @param {string} filename
 * @returns {import('rollup').RollupOptions}
 */
const buildEntryFileConfig = (filename) => {
  const baseFilenameWithoutExt = filename.replace(/\.[jt]sx?$/, '')

  return {
    input: `./${baseFilenameWithoutExt}.ts`,
    // ignore lib
    external,

    output: [
      {
        file: `${dir}/${baseFilenameWithoutExt}.cjs`,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.min.cjs`,
        format: 'cjs',
        sourcemap: false,
        plugins: [minify()],
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.js`,
        format: 'esm',
        sourcemap: false,
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.min.js`,
        format: 'esm',
        sourcemap: false,
        plugins: [minify()],
      },
    ],
    plugins: [...plugins],

    treeshake: true,
  }
}

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  buildEntryFileConfig('index.ts'),

  buildEntryFileConfig('index.windi.ts'),

  ...buildComponentsConfig(false),
  ...buildComponentsConfig(true),
]

export default config
