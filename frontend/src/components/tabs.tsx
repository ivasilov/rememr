'use client'
import { Tab as HeadlessTab } from '@headlessui/react'

import { PropsWithChildren } from 'react'
import { classNames } from '../lib/classnames'

export const TabGroup = ({ children, ...rest }: PropsWithChildren<{ defaultIndex?: number }>) => {
  return <HeadlessTab.Group {...rest}>{children}</HeadlessTab.Group>
}
export const TabList = ({ children }: PropsWithChildren<{}>) => {
  return (
    <HeadlessTab.List as="div" className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {children}
      </nav>
    </HeadlessTab.List>
  )
}
export const Tab = ({ children }: PropsWithChildren<{}>) => {
  return (
    <HeadlessTab
      className={({ selected }) =>
        classNames(
          'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium outline-none',
          selected
            ? 'border-primary-500 text-primary-600'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
        )
      }
    >
      {children}
    </HeadlessTab>
  )
}
export const TabPanels = ({ children }: PropsWithChildren<{}>) => {
  return <HeadlessTab.Panels className="mt-2">{children}</HeadlessTab.Panels>
}
export const TabPanel = ({ children }: PropsWithChildren<{}>) => {
  return <HeadlessTab.Panel>{children}</HeadlessTab.Panel>
}
