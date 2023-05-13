import type { FC } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { useUserStore } from '~/atoms/user'
import { withNoSSR } from '~/components/common/HoC/no-ssr'
import { TextFade } from '~/components/ui/Animate/text-anim'
import { Avatar } from '~/components/ui/Avatar'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { BottomUpTransitionView } from '~/components/ui/Transition/bottom-up'
import { FontIcon } from '~/components/universal/FontIcon'
import { useThemeConfig } from '~/hooks/app/use-initial-data'

import { useHomePageViewContext } from './context'
import styles from './intro.module.css'

const wrapperProps = { className: '!w-full !h-full !border-none !shadow-none' }
export const HomeIntro: FC = () => {
  const { doAnimation } = useHomePageViewContext()
  const user = useUserStore((state) => state.master)

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
}
// 首页 社交 图标栏
const Social: FC = withNoSSR(() => {
  const config = useThemeConfig()
  const { doAnimation } = useHomePageViewContext()
  const { social } = config.site

  return (
    <TransitionGroup appear={doAnimation} className="social-icons space-x-4">
      {social.map((item, i) => {
        return (
          <BottomUpTransitionView
            appear={doAnimation}
            timeout={{ enter: 500 + 50 * i }}
            key={item.title}
          >
            <FloatPopover
              placement="bottom"
              triggerComponent={() => (
                <a
                  href={item.url}
                  target="_blank"
                  style={
                    item.color ? { backgroundColor: item.color } : undefined
                  }
                >
                  <FontIcon icon={item.icon} />
                </a>
              )}
              headless
            >
              <div className="bg-light-bg border-dark-100 shadow-out-sm rounded-full border border-opacity-10 px-3 py-2">
                {item.title}
              </div>
            </FloatPopover>
          </BottomUpTransitionView>
        )
      })}
    </TransitionGroup>
  )
})
