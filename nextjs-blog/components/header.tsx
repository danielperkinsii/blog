
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import Image from 'next/image'

const name = 'Daniel Perkins'

export default function Header() {
  const router: NextRouter = useRouter()
  return (<header className="">
    { router.asPath === '/' || router.asPath === '/about' || router.asPath === '/reading' ? (
      <>
        <Image
          src="/images/profile.jpg"
          className="rounded-2xl"
          alt={name}
          height='512'
          width='384'/>
        <h1 className="text-4xl text-center">{name}</h1>
      </>
    ) : (
      <>
        <Link href="/">
          <a>
            <Image
              src="/images/profile.jpg"
              className="rounded-2xl"
              alt={name}
              height='400'
              width='300'/>
          </a>
        </Link>
        <h2 className="">
          <Link href="/">
            <a className="text-4xl text-center no-underline text-black">{name}</a>
          </Link>
        </h2>
      </>
    )}
  </header>
)}
