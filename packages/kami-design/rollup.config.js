// @ts-check

import esbuild from 'rollup-plugin-esbuild'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import css from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import WindiCSS from 'rollup-plugin-windicss'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const buildEntryFileConfig = (filename, config) => {
  const baseFilenameWithoutExt = filename.replace(/\.[jt]sx?$/, '')
  const { plugins = [] } = config || {}
  return {
    input: `./${baseFilenameWithoutExt}.ts`,
    // ignore lib
    external: [
      'react',
      'react-dom',
      'lodash',
      'lodash-es',
      ...Object.keys(globals),
    ],

    output: [
      {
        file: `${dir}/${baseFilenameWithoutExt}.cjs`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.min.cjs`,
        format: 'cjs',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: `${dir}/${baseFilenameWithoutExt}.min.js`,
        format: 'esm',
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      ...plugins,

      nodeResolve(),
      commonjs({ include: 'node_modules/**' }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      css({
        // extract: true,
      }),

      // @ts-ignore
      peerDepsExternal(),

      esbuild({
        // All options are optional
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        sourceMap: true, // default
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017', // default, or 'es20XX', 'esnext'
        jsx: 'transform', // default, or 'preserve'
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        // Like @rollup/plugin-replace

        tsconfig: 'tsconfig.json', // default
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          '.json': 'json',
          // Enable JSX in .js files too
          '.js': 'jsx',
        },
      }),
    ],

    treeshake: true,
  }
}

const packageJson = require('./package.json')

const globals = {
  // @ts-ignore
  ...(packageJson?.dependencies || {}),
}

const dir = 'dist'

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  buildEntryFileConfig('index.ts'),

  // TODO merge
  buildEntryFileConfig('index.windi.ts', {
    plugins: [
      // @ts-ignore
      ...WindiCSS(),
    ],
  }),
]

export default config
