import Head from 'next/head'
import layoutStyles from '../styles/layout.module.css'
import Link from 'next/link'
import Header from './header'
import Nav from './nav'
import React from 'react'

export const siteTitle = 'Daniel Perkins\' Website'

export default function Layout({ children, home }: { children: React.ReactNode, home?: boolean }) {
  return (
    <div className={layoutStyles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Having a lot of fun over here."
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header/> {/* Header component */}
      <Nav/> {/* Nav component */}
      <main>{children}</main>
      {!home && (
        <div className={layoutStyles.backToHome}>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}