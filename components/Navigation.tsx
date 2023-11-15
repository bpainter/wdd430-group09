// components/Navigation.tsx
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'

export default function Navigation() {
  // const { data: session, status } = useSession()

  return (
    <SessionProvider>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/api/auth/signin">Log in</Link>
        <Link href="/api/auth/signup">Sign up</Link>
        {/* {!session && (
          <>
            <Link href="/api/auth/signin">Log in</Link>
            <Link href="/api/auth/signup">Sign up</Link>
          </>
        )}
        {session && (
          <>
            <Link href="/account">My account</Link>
          </>
        )} */}
      </nav>
    </SessionProvider>
  )
}