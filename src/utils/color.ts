/*
 * @Author: Innei
 * @Date: 2020-05-26 17:52:41
 * @LastEditTime: 2020-06-14 20:17:06
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/color.ts
 * @Copyright
 */
export function hexToRGB(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } else {
    return `rgb(${r}, ${g}, ${b})`
  }
}
