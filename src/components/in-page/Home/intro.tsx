import { TextFade } from 'components/universal/Animate/text-anim'
import { Avatar } from 'components/universal/Avatar'
import { FontIcon } from 'components/universal/FontIcon'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { useThemeConfig } from 'hooks/use-initial-data'
import { observer } from 'mobx-react-lite'
import { useIndexViewContext } from 'pages'
import type { FC } from 'react'
import { TransitionGroup } from 'react-transition-group'
import { useStore } from 'store'
import { NoSSR } from 'utils'

import styles from './intro.module.css'

const wrapperProps = { className: '!w-full !h-full !border-none !shadow-none' }
export const HomeIntro: FC = observer(() => {
  const { doAnimation } = useIndexViewContext()
  const { userStore } = useStore()
  const { master: user } = userStore

  if (!user) {
    return null
  }
  return (
    <section className={styles['root']}>
      <div className="intro-avatar">
        <Avatar
          useRandomColor={false}
          imageUrl={user.avatar || ''}
          alt={user.name}
          wrapperProps={wrapperProps}
        />
      </div>
      <div className="intro-info">
        <h1>
          <TextFade>{user.name || ''}</TextFade>
        </h1>
        <div className="paragraph">
          <TextFade duration={10} appear={doAnimation}>
            {user.introduce || ''}
          </TextFade>
        </div>
        <Social />
      </div>
    </section>
  )
})
// 首页 社交 图标栏
const Social = NoSSR(() => {
  const config = useThemeConfig()
  const { doAnimation } = useIndexViewContext()
  const { social } = config.site
  return (
    <TransitionGroup appear={doAnimation} className="social-icons space-x-4">
      {social.map((item, i) => {
        return (
          <BottomUpTransitionView
            appear={doAnimation}
            timeout={{ enter: 500 + 30 * i }}
            key={item.title}
          >
            <a
              href={item.url}
              target="_blank"
              style={item.color ? { color: item.color } : undefined}
            >
              <FontIcon icon={item.icon} />
            </a>
          </BottomUpTransitionView>
        )
      })}
    </TransitionGroup>
  )
})
