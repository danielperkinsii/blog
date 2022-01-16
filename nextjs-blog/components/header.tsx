
import layoutStyles from '../styles/layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import Image from 'next/image'

const name = 'Daniel Perkins'

export default function Header() {
  const router: NextRouter = useRouter()
  return (<header className={layoutStyles.header}>
    { router.asPath === '/' || router.asPath === '/about' || router.asPath === '/reading' ? (
      <>
        <Image
          src="/images/profile.png"
          className={`${layoutStyles.headerHomeImage} ${utilStyles.borderCircle} ${utilStyles.donutImgCrop}`}
          alt={name}
          height='300'
          width='300'/>
        <h1 className={``}>{name}</h1>
      </>
    ) : (
      <>
        <Link href="/">
          <a>
            <Image
              src="/images/profile.png"
              className={`${layoutStyles.headerImage} ${utilStyles.borderCircle} ${utilStyles.donutImgCrop}`}
              alt={name}
              height='180'
              width='180'/>
          </a>
        </Link>
        <h2 className={utilStyles.headingLg}>
          <Link href="/">
            <a className={utilStyles.colorInherit}>{name}</a>
          </Link>
        </h2>
      </>
    )}
  </header>
)}
