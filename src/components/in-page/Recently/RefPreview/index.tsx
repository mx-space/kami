import { Link } from '~/i18n/navigation'
import type { FC } from 'react'
import { useMemo } from 'react'

import { Divider } from '~/components/ui/Divider'
import { PhLinkFill } from '~/components/ui/Icons/for-recently'
import { urlBuilder } from '~/utils/url'

export const RefPreview: FC<{ refModel: any }> = (props) => {
  const title = props.refModel?.title

  const url = useMemo(() => {
    return urlBuilder.build(props.refModel)
  }, [props.refModel])

  if (!title) {
    return null
  }

  return (
    <>
      <Divider className="my-4 w-12 bg-current opacity-50" />
      <p className="flex items-center leading-[1.8]">
        发表于： <PhLinkFill className="mr-2" />
        <Link href={url}>{title}</Link>
      </p>
    </>
  )
}
