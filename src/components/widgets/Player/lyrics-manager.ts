// @see https://github.com/qier222/YesPlayMusic/blob/new-design/packages/web/utils/lyric.ts

const extractRegex =
  /^\[(?<time>(?<min>\d+):(?<sec>\d+)(?:\.|:)*(?<ms>\d+)*)\](?!\[)(?<content>.+)$/

export interface LyricsContent {
  hms: string
  content: string
}

interface LyricsTimeline {
  list: LyricsContent[]
  timestampList: number[]
}

export class LyricsManager {
  private _lines = [] as string[]
  private _timeline: LyricsTimeline

  constructor(public readonly lyrics: string) {
    this._lines = lyrics.split('\n')
    this._timeline = (() => {
      const list = [] as any[]
      const tsList = [] as number[]
      for (const line of this._lines) {
        const matched = line.match(extractRegex)
        if (!matched) {
          continue
        }
        const { groups } = matched
        const { min, sec, ms, content, time } = groups!

        if (content === '纯音乐，请欣赏') continue

        if (
          content.match(
            // https://regexr.com/6j8pf
            /.*(?<role>作曲|作词|编曲|制作|Producers|Producer|Produced|贝斯|工程师|吉他|合成器|助理|编程|制作|和声|母带|人声|鼓|混音|中提琴|编写|Talkbox|钢琴|出版|录音|发行|出品|键盘|弦乐|设计|监制|原曲|演唱|声明|版权|封面|插画|统筹|企划|填词|原唱|后期|和音|琵琶).*[:：]\s*(?<name>.*)/,
          )
        ) {
          continue
        }
        const ts = +ms + +sec * 1000 + +min * 60 * 1000
        tsList.push(ts)

        list.push({
          hms: time,
          content,
        })
      }

      return {
        list,
        timestampList: tsList,
      }
    })()
  }

  getCurrentTimeline(time: number, size = 4): LyricsContent[] {
    // 第一行 是上一行 第二行开始是当前行以及后面的
    const index = this.searchNumberInRange(time) - 2
    if (index <= 0) {
      return [
        {
          hms: 'start',
          content: '',
        },
      ].concat(this._timeline.list.slice(0, size - 1))
    }
    const result = this._timeline.list.slice(index, index + size)
    return result.length < size
      ? result.concat(
          Array.from({ length: size - result.length }).map((_, i) => {
            return {
              content: '',
              hms: `END-${i}`,
            }
          }),
        )
      : result
  }

  private searchNumberInRange(target: number) {
    const times = this._timeline.timestampList
    const n = times.length
    let left = 0,
      right = n - 1,
      index = n
    while (left <= right) {
      const mid = ((right - left) >> 1) + left
      if (target <= times[mid]) {
        index = mid
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
    return index
  }
}
