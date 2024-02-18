import { faBook, faHome, faXmark, IconLookup } from '@fortawesome/free-solid-svg-icons'
import { Dialog, Transition } from '@headlessui/react'

import { classNames } from '@/src/lib/classnames'
import { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dispatch, Fragment, SetStateAction } from 'react'
import { Icon } from '../../icon'
import { Logo } from '../../logo'
import { PageCategories } from './page-categories'

export const PageLink = ({
  name,
  href,
  icon,
  className,
}: {
  name: string
  href: string
  icon: IconLookup
  className?: string
}) => {
  const pathname = usePathname()
  const current = pathname === href

  const classes = classNames(
    className,
    current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
  )

  return (
    <Link href={href as Route} className={classes}>
      <Icon
        className={classNames(
          current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
          'mr-4 h-6 w-6 flex-shrink-0',
        )}
        aria-hidden="true"
        name={icon}
      />
      {name}
    </Link>
  )
}

const PageLinks = ({ className }: { className?: string }) => {
  return (
    <nav className="h-full flex-1 space-y-8 px-2" aria-label="Sidebar">
      <div className="space-y-1">
        <PageLink key="all-bookmarks" name="All bookmarks" href="/bookmarks" icon={faHome} className={className} />
        <PageLink key="reading-list" name="Reading list" href="/bookmarks/unread" icon={faBook} className={className} />
      </div>
      <PageCategories className={className} />
    </nav>
  )
}

export const Sidebar = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pb-4 pt-5">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <Icon name={faXmark} className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <Link href="/">
                  <div className="flex h-20 flex-shrink-0 items-center bg-gray-900 py-2 pl-10 pr-4 text-white">
                    <Logo />
                    <h1 className="mx-4 text-2xl">rememr</h1>
                  </div>
                </Link>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <PageLinks className="text-base" />
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <Link href="/">
            <div className="flex h-20 flex-shrink-0 items-center bg-gray-900 py-2 pl-10 pr-4 text-white">
              <Logo />
              <h1 className="mx-4 text-2xl">rememr</h1>
            </div>
          </Link>
          <div className="mt-5 flex h-full flex-col">
            <PageLinks className="text-sm" />
          </div>
        </div>
      </div>
    </>
  )
}
