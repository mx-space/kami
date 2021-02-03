/*
 * @Author: Innei
 * @Date: 2021-02-03 20:37:04
 * @LastEditTime: 2021-02-03 20:40:59
 * @LastEditors: Innei
 * @FilePath: /web/tailwind.config.js
 * @Mark: Coding with Love
 */

module.exports = {
  purge: {
    content: [
      './components/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 768px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1023px)' },
      },

      opacity: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
      },
      zIndex: {
        '-10': -10,
        '-1': -1,
        0: 0,
        1: 1,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        auto: 'auto',
      },
      colors: {},
    },
  },
  variants: {},
  plugins: [],
}
