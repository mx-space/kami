import { PlayListType } from '@mx-space/extra'
import { observer } from 'mobx-react'
import { FC } from 'react'
import { useStore } from 'common/store'

interface SectionMusicProps {
  data: PlayListType[]
  src: string
  name: string
}

export const SectionMusic: FC<SectionMusicProps> = observer((props) => {
  const { musicStore } = useStore()
  const loadList = (id: number[]) => {
    musicStore.setPlaylist(id)
  }
  return (
    <section className={'paul-music'}>
      <style jsx>{`
        .sticky-cover {
          position: sticky;
          top: 5rem;
        }
        * {
          font-size: 16px;
        }
      `}</style>
      <div className="music-cover">
        <div className="sticky-cover fixed-cover">
          <img src={props.src}></img>
          <h3>{props.name}</h3>
        </div>
      </div>

      <div className="music-list">
        <ul className="clear">
          {props.data.map((i, index) => {
            return (
              <li
                key={index}
                onClick={(_) =>
                  loadList(
                    props.data.filter((_, i) => i >= index).map((i) => i.id),
                  )
                }
              >
                <span className={'num'}>{index + 1}</span>
                {i.name}
                <time>{i.time}</time>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
})
