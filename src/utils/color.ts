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

export const isDarkColorHex = (color: string) => {
  const hex = color.replace('#', '')
  const c_r = parseInt(hex.substring(0, 2), 16)
  const c_g = parseInt(hex.substring(2, 4), 16)
  const c_b = parseInt(hex.substring(4, 6), 16)
  const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000

  return brightness <= 155
}
