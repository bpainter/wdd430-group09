import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
        </li>
        {!session && <li><Link href="/login">Login</Link></li>}
        {!session && <li><Link href="/signup">Create Account</Link></li>}
        {session && <li><Link href="/profile">Profile</Link></li>}
        {session && session.user && session.user.role === 'admin' && <li><Link href="/admin">Admin</Link></li>}
        {session && <li><button onClick={() => signOut()}>Logout</button></li>}
      </ul>
    </nav>
  );
}
