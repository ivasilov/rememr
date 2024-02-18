'use client';
import { faBars, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Menu, Transition } from '@headlessui/react';

import { classNames } from '@/src/lib/classnames';
import { createClient } from '@/src/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, PropsWithChildren, useCallback, useState } from 'react';
import { Icon } from '../icon';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Sidebar } from './sidebar';

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.refresh();
  }, [router, supabase.auth]);

  return (
    <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex min-h-screen flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="focus:ring-primary-500 border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Icon name={faBars} className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form className="flex w-full md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <Icon name={faMagnifyingGlass} className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="search-field"
                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="focus:ring-primary-500 flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2">
                    <Avatar>
                      {/* <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" /> */}
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item key="settings">
                      {({ active }) => (
                        <Link
                          href="/account"
                          className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item key="Sign out">
                      {({ active }) => (
                        <a
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block cursor-pointer px-4 py-2 text-sm text-gray-700',
                          )}
                          onClick={signOut}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="flex grow flex-col items-center bg-slate-100 px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </>
  );
};
