import { PlayListType } from '@mx-space/extra'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useStore } from 'store'
import styles from './index.module.css'

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
    <section className={styles['kami-music']}>
      <div className={styles['music-cover']}>
        <div className={clsx(styles['fixed-cover'], styles['sticky-cover'])}>
          <img src={props.src}></img>
          <h3>{props.name}</h3>
        </div>
      </div>

      <div className={styles['music-list']}>
        <ul className="">
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
                <span className={styles['num']}>{index + 1}</span>
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
