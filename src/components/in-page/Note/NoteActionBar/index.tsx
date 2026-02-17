import dayjs from 'dayjs'
import type { FC } from 'react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import { useNoteCollection } from '~/atoms/collections/note'
import { RelativeTime } from '~/components/common/RelativeTime'
import {
  GgCoffee,
  MdiClockTimeThreeOutline,
  PhBookOpen,
} from '~/components/ui/Icons/for-note'
import { LikeButton } from '~/components/ui/LikeButton'
import { NumberTransition } from '~/components/ui/NumberRecorder'
import type { ActionProps } from '~/components/widgets/ArticleAction'
import { ArticleFooterAction } from '~/components/widgets/ArticleAction'
import { DonatePopover } from '~/components/widgets/Donate'
import { mood2icon, weather2icon } from '~/constants/meta-icon'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useThemeConfig } from '~/hooks/app/use-initial-data'

export const NoteFooterActionBar: FC<{ id: string }> = ({ id }) => {
  const t = useTranslations('note')
  const tCommon = useTranslations('common')
  const note = useNoteCollection((state) => state.get(id), shallow)
  const isLiked =
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    useNoteCollection((state) => state.isLiked(note?.nid!) || false)
  const trackerLikeOnce = useRef(false)
  const { event } = useAnalyze()
  const themeConfig = useThemeConfig()
  if (!note) {
    return null
  }
  const nid = note.nid
  const { mood, weather } = note
  const isSecret = note.publicAt ? dayjs(note.publicAt).isAfter(new Date()) : false

  const donateConfig = themeConfig.function.donate

  const actions: ActionProps = {
    informs: [],
    actions: [
      donateConfig.enable && {
        icon: <GgCoffee fontSize="1.2em" />,
        name: '',
        wrapperComponent: DonatePopover,
        callback: () => {
          window.open(donateConfig.link)
        },
      },
      {
        name: (
          <div className="inline-flex items-center leading-[1]">
            <div className="relative mr-2 h-[1rem] w-[1rem]">
              <LikeButton
                checked={isLiked}
                width="2rem"
                className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 transform "
              />
            </div>
            <NumberTransition number={note.count?.like || 0} className="ml-4" />
          </div>
        ),
        color: isLiked ? '#e74c3c' : undefined,

        callback: () => {
          useNoteCollection.getState().like(nid, {
            alreadyLiked: t('alreadyLiked'),
            thanksLike: t('thanksLike'),
          })

          if (!trackerLikeOnce.current) {
            event({
              action: TrackerAction.Interaction,
              label: tCommon('trackNoteLike'),
            })

            trackerLikeOnce.current = true
          }
        },
      },
    ],
  }
  {
    if (weather) {
      actions.informs!.push({
        name: weather,
        icon: weather2icon(weather),
      })
    }
    if (mood) {
      actions.informs!.push({
        name: mood,
        icon: mood2icon(mood),
      })
    }

    actions.informs!.push(
      {
        name: <RelativeTime date={note.created} />,
        icon: <MdiClockTimeThreeOutline />,
        tip: () => (
          <p className="leading-7">
            {t('createdAt')}{new Date(note.created).toLocaleDateString()}
            <br />
            {t('modifiedAt')}{' '}
            {note.modified ? new Date(note.modified).toLocaleTimeString() : '-'}
          </p>
        ),
      },
      {
        name: note.count.read.toString(),
        icon: <PhBookOpen />,
      },
    )
  }

  return <>{!isSecret && <ArticleFooterAction {...actions} />}</>
}
