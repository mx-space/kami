import { FC } from 'react'
import { PlayListType } from '@mx-space/extra'

interface SectionMusicProps {
  data: PlayListType[]
  src: string
  name: string
}

export const SectionMusic: FC<SectionMusicProps> = (props) => {
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
        <div className="sticky-cover">
          <img src={props.src}></img>
          <h3>{props.name}</h3>
        </div>
      </div>

      <div className="music-list">
        <ul className="clear">
          {props.data.map((i, index) => {
            return (
              <li data-sid={i.id} key={index}>
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
}
