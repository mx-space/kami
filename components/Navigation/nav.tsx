import { HeaderNavigation } from 'components/Navigation'
import { FC } from 'react'

export const FavoriteNav: FC<{ index: number }> = (props) => {
  return (
    <HeaderNavigation
      {...{
        activeIndex: props.index,
        items: [
          {
            title: '歌单',
            href: '/favorite/music',
          },
          {
            title: '追番',
            href: '/favorite/bangumi',
          },
        ],
      }}
    />
  )
}
