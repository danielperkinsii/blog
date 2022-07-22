
import { NextRouter, useRouter } from 'next/router'
import Image from 'next/image'

const name = 'Daniel Perkins'

export default function Header() {
  const router: NextRouter = useRouter()
  return (<header>
      <>
        <Image
          src="/images/profile.jpg"
          className="rounded-2xl"
          alt={name}
          height='512'
          width='384'/>
        <h1 className="text-4xl text-center">{name}</h1>
      </>
  </header>
)}
