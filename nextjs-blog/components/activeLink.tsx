import { NextRouter, useRouter } from 'next/router'
import React from 'react'
import utilStyles from '../styles/utils.module.css'

export default function ActiveLink({ children, hrefLink }: { children: any, hrefLink: string }) {
  const router = useRouter()
  const selected: string = router.asPath === hrefLink ? utilStyles.selected : ''

  const handleClick = (e: any): void => {
    e.preventDefault()
    router.push(hrefLink)
  }

  return (
    <>
        <a href={hrefLink} onClick={handleClick} className={`${utilStyles.marginSides10px} ${selected}`}>
            {children}
        </a>
    </>
  )
}