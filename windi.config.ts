import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  extract: {
    include: ['**/*.{jsx,tsx,css}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  darkMode: 'class',
  plugins: [
    require('windicss/plugin/line-clamp'),
    plugin(({ addComponents, addDynamic, variants }) => {
      const styles = {
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.shadow-out-sm': {
          'box-shadow':
            '0 0 10px rgb(128 128 128 / 10%), 0 5px 20px rgb(128 128 128 / 20%)',
        },
      }
      addComponents(styles)
      addDynamic(
        'contain-intrinsic',
        ({ Utility, Style }) => {
          return Utility.handler
            .handleStatic(Style('contain-intrinsic'))
            .handleNumber(0, Infinity, 'int', (number) => `${number}px`)
            .handleSize((size) => {
              return size
            })
            .createProperty('contain-intrinsic-size')
        },
        variants('contain-intrinsic'),
      )
    }),
  ],
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 568px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1023px)' },
        wider: { raw: '(min-width: 1500px)' },
      },
      fontFamily: {
        serif: 'var(--serif-font)',
        sans: 'var(--sans-font)',
        mono: 'var(--monospace-font)',
      },

      colors: {
        primary: 'var(--primary)',
        red: 'var(--red)',
        yellow: 'var(--yellow)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        brown: 'var(--brown)',
        'light-brown': 'var(--light-brown)',
        purple: 'var(--purple)',
        'light-bg': 'var(--light-bg)',
        'light-font': 'var(--light-font)',
        'bg-opacity': 'var(--bg-opacity)',
        gray: 'var(--gray)',
        deepgray: 'var(--deep-gray)',
        shallow: 'var(--shallow)',
        pink: 'var(--pink)',
        'gray-1': 'var(--gray-1)',
        'gray-2': 'var(--gray-2)',
        'gray-3': 'var(--gray-3)',
        'gray-4': 'var(--gray-4)',
        'gray-5': 'var(--gray-5)',
        'gray-6': 'var(--gray-6)',

        shizuku: {
          text: 'var(--shizuku-text-color)',
          theme: 'var(--shizuku-theme-color)',
          bg: 'var(--shizuku-background-color)',
        },
      },
    },
  },
})
