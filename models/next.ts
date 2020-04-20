import { NextPageContext } from 'next'
import { BaseContext } from 'next/dist/next-server/lib/utils'

export interface NextComponent<
  C extends BaseContext = NextPageContext,
  IP = {},
  P = {}
> {
  getInitialProps?(C: NextPageContext): any
}
