import { useRouter } from 'next/router'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

export default function ActiveLink({ children, href }) {
  const router = useRouter()
  const selected = router.asPath === href ? utilStyles.selected : ''


  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <>
        <a href={href} onClick={handleClick} className={`${utilStyles.marginSides10px} ${selected}`}>
            {children}
        </a>
    </>
  )
}