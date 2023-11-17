import Link from 'next/link';
import { HiHome, HiShoppingCart, HiUserGroup, HiUserCircle, HiOutlineCog, HiLogout, HiOutlineLogin } from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navigation() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Handcrafted Haven
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <HiHome className="inline-block mr-2" />
                  Home
                </Link>
                <Link href="/products" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <HiShoppingCart className="inline-block mr-2" />
                  Products
                </Link>
                <Link href="/artisans" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <HiUserGroup className="inline-block mr-2" />
                  Artisans
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              {!session && (
                <>
                  <Link href="/login" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <HiOutlineLogin className="inline-block mr-2" />
                    Login
                  </Link>
                  <Link href="/signup" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <HiUserCircle className="inline-block mr-2" />
                    Create Account
                  </Link>
                </>
              )}
              {session && (
                <>
                  <Link href="/profile" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <HiUserCircle className="inline-block mr-2" />
                    Profile
                  </Link>
                  {session.user && session.user.role === 'admin' && (
                    <Link href="/admin" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      <HiOutlineCog className="inline-block mr-2" />
                      Admin
                    </Link>
                  )}
                  <button onClick={() => signOut()} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <HiLogout className="inline-block mr-2" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
