import { QueueAnim } from 'components/universal/Anime'
import { Avatar } from 'components/universal/Avatar'
import { FontIcon } from 'components/universal/FontIcon'
import { useThemeConfig } from 'hooks/use-initial-data'
import { observer } from 'mobx-react-lite'
import TextyAnim from 'rc-texty'
import { FC, useMemo } from 'react'
import { useStore } from 'store'
import { NoSSR } from 'utils'
import styles from './intro.module.css'

const wrapperProps = { className: '!w-full !h-full !border-none !shadow-none' }
export const HomeIntro: FC = observer(() => {
  const { userStore } = useStore()
  const { master: user } = userStore

  if (!user) {
    return null
  }
  return (
    <section className={styles['root']}>
      <div className="intro-avatar ">
        <Avatar
          useRandomColor={false}
          imageUrl={user.avatar || ''}
          alt={user.name}
          wrapperProps={wrapperProps}
        />
      </div>
      <div className="intro-info">
        <h1>
          <TextyAnim type={'mask-bottom'} mode={'smooth'}>
            {user.name}
          </TextyAnim>
        </h1>
        <div className="paragraph">
          <TextyAnim
            type={'mask-bottom'}
            mode={'smooth'}
            delay={500}
            duration={10}
          >
            {user.introduce}
          </TextyAnim>
        </div>
        <Social />
      </div>
    </section>
  )
})

const Social = NoSSR(() => {
  const config = useThemeConfig()
  const { social } = config.site
  return (
    <QueueAnim
      delay={500}
      duration={500}
      animConfig={useMemo(() => ({ opacity: [1, 0], translateY: [0, 50] }), [])}
    >
      <div className="social-icons" key={'a'}>
        {social.map((item) => {
          return (
            <a
              href={item.url}
              target="_blank"
              key={item.title}
              style={item.color ? { color: item.color } : undefined}
            >
              <FontIcon icon={item.icon} />
            </a>
          )
        })}
      </div>
    </QueueAnim>
  )
})
