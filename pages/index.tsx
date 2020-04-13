import React from 'react'
// import { NextPage, NextPageContext } from 'next'
import { NextSeo } from 'next-seo'
// import axios from 'axios'

interface data {
  data: string
}
class Index extends React.Component<data> {
  // static async getInitialProps() {
  //   const { data } = await axios.get(
  //     'http://47.114.54.60:2333/posts?size=10&page=1'
  //   )
  //   return { data: JSON.stringify(data) }
  // }
  render() {
    return (
      <>
        <NextSeo title="Home" description="" />
        {/* <div className="">{this.props.data}</div> */}
      </>
    )
  }
}

export default Index
