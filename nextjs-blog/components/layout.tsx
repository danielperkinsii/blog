import Head from 'next/head'
import Link from 'next/link'
import Header from './header'
import Nav from './nav'
import React from 'react'

export const siteTitle = 'Daniel\'s Blog 💡'

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className="flex flex-col items-center p-4 tracking-tight">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Having a lot of fun over here."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@danielperkinsii" />
      </Head>
      <Header/> {/* Header component */}
      <Nav/> {/* Nav component */}
      <main>{children}</main>
      {!home && (
        <div className="p-4 text-blue-500 tracking-tight font-bold hover:text-blue-600">
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}