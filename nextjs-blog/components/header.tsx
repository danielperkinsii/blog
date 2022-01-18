
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
          src="/images/profile.png"
          className="rounded-full"
          alt={name}
          height='300'
          width='300'/>
        <h1 className="text-4xl text-center">{name}</h1>
      </>
    ) : (
      <>
        <Link href="/">
          <a>
            <Image
              src="/images/profile.png"
              className="rounded-full"
              alt={name}
              height='180'
              width='180'/>
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
