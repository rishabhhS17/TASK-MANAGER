'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from 'firebase/auth'
import ProfileDropdown from '@/components/ProfileDropdown/ProfileDropdown'
import styles from './Navbar.module.css'

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <Link href="/" className={styles.logo} aria-label="LockIn home">
        LockIn
      </Link>

      <div className={styles.links}>
        <Link
          href="/"
          className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          Today
        </Link>
        <Link
          href="/backlog"
          className={`${styles.link} ${pathname === '/backlog' ? styles.active : ''}`}
          aria-current={pathname === '/backlog' ? 'page' : undefined}
        >
          Backlog
        </Link>
        <Link
          href="/recurring"
          className={`${styles.link} ${pathname === '/recurring' ? styles.active : ''}`}
          aria-current={pathname === '/recurring' ? 'page' : undefined}
        >
          Recurring
        </Link>
      </div>

      <ProfileDropdown user={user} />
    </nav>
  )
}
