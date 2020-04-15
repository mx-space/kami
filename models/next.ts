import { NextPageContext } from 'next'
import { ComponentType } from 'react'
import { BaseContext } from 'next/dist/next-server/lib/utils'

export interface NextComponent<
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
> {
  getInitialProps?(C: NextPageContext): any
}
