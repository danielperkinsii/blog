import { useRouter } from 'next/router'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

export default function ActiveLink({ children, hrefLink }) {
  const router = useRouter()
  const selected = router.asPath === hrefLink ? utilStyles.selected : ''

  const handleClick = (e) => {
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