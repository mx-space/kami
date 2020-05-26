/*
 * @Author: Innei
 * @Date: 2020-05-26 17:52:41
 * @LastEditTime: 2020-05-26 17:52:42
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/color.ts
 * @Copyright
 */
export function hexToRGB(hex: string, alpha: number) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')'
  }
}
