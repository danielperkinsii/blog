import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Layout, { siteTitle } from '../components/layout'
import { getSortedPostsData } from '../lib/posts'
import Date from '../components/date'
import randomQuote from '../lib/quotes'

export default function Home({ allPostsData }) {

  const [quote, setQuote] = useState()

  useEffect(() => {
    setQuote(randomQuote)
  }, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌞</text></svg>" />
      </Head>
      {/* make this a component */}
      <section className="max-w-sm">
        <p className="my-4 text-gray-700">{quote}</p>
      </section>
      <section className="">
        <h2 className="text-2xl">Blog</h2>
        <ul>
          {allPostsData.map(({id, date, title}) => (
            <li className="max-w-sm min-h-20 my-2 mx-0 border border-black hover:border-blue-500 p-2 list-none" key={id}>
              <Link href={`/posts/${id}`}>
                <a className="text-blue-500 font-semibold text-lg no-underline">{title}</a>
              </Link>
              <br />
              <small className="">
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}