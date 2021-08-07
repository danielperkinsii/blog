
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const name = 'Daniel Perkins'

export default function Header() {
  const router = useRouter()
  return (<header className={styles.header}>
    { router.asPath === '/' || router.asPath === '/about' || router.asPath === '/reading' ? (
      <>
        <img
          src="/images/profile.jpeg"
          className={`${styles.headerHomeImage} ${utilStyles.borderCircle} ${utilStyles.donutImgCrop}`}
          alt={name}/>
        <h1 className={utilStyles.heading2Xl}>{name}</h1>
      </>
    ) : (
      <>
        <Link href="/">
          <a>
            <img
              src="/images/profile.jpeg"
              className={`${styles.headerImage} ${utilStyles.borderCircle} ${utilStyles.donutImgCrop}`}
              alt={name}/>
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
