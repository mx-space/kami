import { Weather, Mood } from 'models/dto/note'
import {
  IconDefinition,
  faSun,
  faCloud,
  faCloudSun,
  faSnowflake,
  faCloudRain,
} from '@fortawesome/free-solid-svg-icons'
import {
  faSmile,
  faSadCry,
  faAngry,
  faTired,
  faMeh,
  faGrinSquint,
  faFrownOpen,
  faGrimace,
  faFlushed,
} from '@fortawesome/free-regular-svg-icons'

export const weather2icon = (weather: keyof typeof Weather) => {
  const map: Record<typeof weather, IconDefinition> = {
    sunshine: faSun,
    cloudy: faCloudSun,
    overcast: faCloud,
    snow: faSnowflake,
    rainy: faCloudRain,
  }
  return map[weather]
}

export const mood2icon = (mood: keyof typeof Mood) => {
  const map: Record<typeof mood, IconDefinition> = {
    happy: faSmile,
    sad: faSadCry,
    angry: faAngry,
    pain: faTired,
    sorrow: faMeh,
    unhappy: faMeh,
    excite: faGrinSquint,
    worry: faFrownOpen,
    terrible: faGrimace,
    detestable: faAngry,
    despair: faFrownOpen,
    anxiety: faFlushed,
  }
  return map[mood]
}
