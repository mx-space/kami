import { NextPageContext } from 'next'

export const parseIncomingUrl = (ctx: NextPageContext) => {
  const { req } = ctx
  req?.headers
}
