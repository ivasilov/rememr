import '@rememr/ui/globals.css'

import { Command, CommandGroup, CommandItem, CommandList } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { browser } from 'browser-namespace'
import { useEffect, useState } from 'react'
import { supabase } from '~core/supabase'

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data) {
        setUser(data.user)
      }
      if (error) {
        console.error(error)
      }
    })
  }, [])

  const sendTabsToRememr = async (tabCount: 'single' | 'all') => {
    setIsLoading(true)
    try {
      const tabs = await browser.tabs.query({ currentWindow: true, ...(tabCount === 'all' ? {} : { active: true }) })
      const bookmarks = tabs
        .filter(tab => tab.url && tab.title)
        .map(tab => ({
          user_id: user?.id,
          url: tab.url!,
          name: tab.title!,
        }))

      const { error } = await supabase.from('bookmarks').insert(bookmarks)

      if (error) throw error
      browser.tabs.remove(tabs.map(tab => tab.id))
    } catch (error) {
      console.error('Error sending tabs:', error)
      alert('Failed to send tabs to rememr.com')
    } finally {
      setIsLoading(false)
    }
  }

  {
    /* <DropdownMenu open={true}>
        <DropdownMenuContent>
          <DropdownMenuItem>Send this tab to rememr.com</DropdownMenuItem>
          <DropdownMenuItem>Send all tabs to rememr.com</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */
  }

  return (
    <div className="bg-background dark flex w-48">
      {user ? (
        <Command>
          <CommandList>
            <CommandGroup className="p-0 font-semibold">
              <CommandItem onClick={() => sendTabsToRememr('single')}>
                <span className="p-2">Save this tab</span>
              </CommandItem>
              <CommandItem onClick={() => sendTabsToRememr('all')}>
                <span className="p-2">Save all tabs</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ) : (
        <button
          onClick={() => browser.runtime.openOptionsPage()}
          className="w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Login on rememr.com
        </button>
      )}
    </div>
  )
}

export default IndexPopup
