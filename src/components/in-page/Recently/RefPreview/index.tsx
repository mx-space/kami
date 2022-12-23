import Link from 'next/link'
import type { FC } from 'react'
import { useMemo } from 'react'

import { Divider } from '@mx-space/kami-design/components/Divider'
import { PhLinkFill } from '@mx-space/kami-design/components/Icons'

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
      <Divider className="my-4 bg-current w-12 opacity-50" />
      <p className="leading-[1.8] flex items-center">
        发表于： <PhLinkFill className="mr-2" />
        <Link href={url}>{title}</Link>
      </p>
    </>
  )
}
