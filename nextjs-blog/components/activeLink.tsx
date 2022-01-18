import { useRouter } from 'next/router'
import React from 'react'

export default function ActiveLink({ children, hrefLink }: { children: React.ReactNode, hrefLink: string, pageName: string}) {
  const router = useRouter()
  const selected: string = router.asPath === hrefLink ? 'text-blue-800' : 'no-underline'

  const handleClick = (e: any): void => {
    e.preventDefault()
    router.push(hrefLink)
  }

  return (
    <>
        <a href={hrefLink} onClick={handleClick} className={`${selected} mx-4`}>
            {children}
        </a>
    </>
  )
}