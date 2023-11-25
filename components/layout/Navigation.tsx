import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn,signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();
  const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Products', href: '/products', current: false },
    { name: 'Artisans', href: '/artisans', current: false },
  ];

  /**
   * Represents the navigation items for the user.
   * If the user is logged in, it includes the profile and logout options.
   * If the user is not logged in, it includes the login and create account options.
   */
  const userNavigation = session ? [
    { name: 'Profile', href: '/profile', current: false },
    { name: 'Logout', href: '#', onClick: () => signOut(), current: false },
  ] : [
    { name: 'Login', href: '/login', current: false },
    { name: 'Create Account', href: '/signup', current: false },
  ];
  
  if (session && session.user.roles && session.user.roles.includes('admin')) {
    userNavigation.unshift({ name: 'Admin', href: '/admin', current: false });
  }

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* ... Logo and primary navigation ... */}
              <div id="header-left" className="flex items-center">
                <div id="logo" className="flex-shrink-0">
                  <Link href="/">
                    <Image
                      className="h-8 w-8"
                      src="/images/artisanal-icon.png"
                      alt="Handcrafted Haven"
                      width={32}
                      height={32}
                    />
                  </Link>
                </div>
                <div id="primary-nav" className="hidden md:block">
                  <ul className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ... User navigation ... */}
              <div id="header-right" className="md:block">
                <div id="user-nav" className="hidden md:block">
                  <ul className="ml-10 flex items-baseline space-x-4">
                    {userNavigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={item.current ? 'page' : undefined}
                          className={classNames(
                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          onClick={item.onClick}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ... Mobile menu button ... */}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
