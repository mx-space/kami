import defaultColors from 'windicss/colors'
import { defineConfig } from 'windicss/helpers'
import plugin from 'windicss/plugin'

export default defineConfig({
  extract: {
    include: ['**/*.{jsx,tsx,css}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  darkMode: 'class',
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- windicss plugins
    require('windicss/plugin/line-clamp'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- windicss plugins
    require('windicss/plugin/aspect-ratio'),
    plugin(({ addComponents, addDynamic, variants }) => {
      const styles = {
        '.content-auto': {
          'content-visibility': 'auto',
        },
        '.shadow-out-sm': {
          'box-shadow':
            '0 0 10px rgb(120 120 120 / 10%), 0 5px 20px rgb(120 120 120 / 20%)',
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
      cursor: {
        'zoom-in': 'zoom-in',
        'zoom-out': 'zoom-out',
      },
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 568px)' },
        desktop: { raw: '(min-width: 1100px)' },
        tablet: { raw: '(max-width: 1099px)' },
        wider: { raw: '(min-width: 1500px)' },

        w900: { raw: '(max-width: 900px)' },
      },
      fontFamily: {
        serif: 'var(--serif-font)',
        sans: 'var(--sans-font)',
        mono: 'var(--monospace-font)',
      },

      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',

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

        deepgray: 'var(--deep-gray)',
        shallow: 'var(--shallow)',
        pink: 'var(--pink)',
        gray: {
          '1': 'var(--gray-1)',
          '2': 'var(--gray-2)',
          '3': 'var(--gray-3)',
          '4': 'var(--gray-4)',
          '5': 'var(--gray-5)',
          '6': 'var(--gray-6)',
        },

        shizuku: {
          text: 'var(--shizuku-text-color)',
          theme: 'var(--shizuku-theme-color)',
          bg: 'var(--shizuku-background-color)',
        },

        always: { ...defaultColors },
      },
    },
  },
})
