import { Component } from 'react'

import { WithRouterProps } from 'next/dist/client/with-router'
import { PageRespDto } from 'models/dto/page'
import { Rest } from 'utils/api'

import { NextPageContext } from 'next'
import { ArticleLayout } from 'layouts/ArticleLayout'
import Markdown from 'components/MD-render'

class Page extends Component<WithRouterProps & PageRespDto> {
  static async getInitialProps(ctx: NextPageContext) {
    const { data } = await Rest('Page', 'slug').get<PageRespDto>(
      ctx.query.page as string,
    )
    return { data }
  }

  render() {
    const { data } = this.props
    const { title, subtitle, text } = data
    return (
      <ArticleLayout title={title} subtitle={subtitle}>
        <Markdown value={text} escapeHtml={false} />
      </ArticleLayout>
    )
  }
}

export default Page
