'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './header.module.css'

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    { name: 'link accounts', path: '/link-accounts' },
    { name: 'search', path: '/search' },
    { name: 'agent', path: '/agent' },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.siteName}>
        <img src="/logo.svg" alt="WhoisWho" width="24" height="32" />
        <Link href="/"> WhoisWho</Link>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${
              pathname === item.path ? styles.active : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
