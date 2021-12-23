import {
  faAngry,
  faFlushed,
  faFrownOpen,
  faGrimace,
  faGrinSquint,
  faMeh,
  faSadCry,
  faSmile,
  faTired,
} from '@fortawesome/free-regular-svg-icons'
import {
  faCloud,
  faCloudRain,
  faCloudSun,
  faSnowflake,
  faSun,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

export const weather2icon = (weather: string) => {
  const map: Record<string, IconDefinition> = {
    晴: faSun,
    多云: faCloudSun,
    阴: faCloud,
    雪: faSnowflake,
    雨: faCloudRain,
  }
  return map[weather] || faCloud
}

export const mood2icon = (mood: string) => {
  const map: Record<string, IconDefinition> = {
    开心: faSmile,
    伤心: faSadCry,
    生气: faAngry,
    痛苦: faTired,
    悲哀: faMeh,
    不快: faMeh,
    激动: faGrinSquint,
    担心: faFrownOpen,
    可怕: faGrimace,
    可恶: faAngry,
    绝望: faFrownOpen,
    焦虑: faFlushed,
  }
  return map[mood] || faSmile
}
