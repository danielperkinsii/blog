import Head from 'next/head'
import Link from 'next/link'
import Header from './header'
import Nav from './nav'
import React from 'react'
import { FAVICON_HREF } from '../lib/site'

export const siteTitle = 'Daniel\'s Blog 💡'

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className="flex flex-col items-center p-4">
      <Head>
        <link rel="icon" href={FAVICON_HREF} />
        <meta
          name="description"
          content="Having a lot of fun over here."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@danielperkinsii" />
      </Head>
      <Header/>
      <Nav/>
      <main>{children}</main>
      {!home && (
        <div className="p-4 tracking-tight font-bold">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Back to home
          </Link>
        </div>
      )}
    </div>
  )
}