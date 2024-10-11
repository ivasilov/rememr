import '@rememr/ui/globals.css'

import { Button } from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { browser } from 'browser-namespace'
import { useEffect, useState } from 'react'
import { supabase } from '~core/supabase'

function IndexPopup() {
  const [user, setUser] = useState<User | null>(null)

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

  const sendTabsToRememr = async (tabCount: 'single' | 'all', readLater: boolean) => {
    try {
      const tabs = await browser.tabs.query({ currentWindow: true, ...(tabCount === 'all' ? {} : { active: true }) })
      const bookmarks = tabs
        .filter(tab => tab.url && tab.title)
        .map(tab => ({
          user_id: user?.id,
          url: tab.url!,
          name: tab.title!,
          read: !readLater,
        }))

      const { error } = await supabase.from('bookmarks').insert(bookmarks)

      if (error) throw error
      browser.tabs.remove(tabs.map(tab => tab.id))
    } catch (error) {
      console.error('Error sending tabs:', error)
      alert('Failed to send tabs to rememr.com')
    }
  }

  return (
    <div className="flex w-60">
      {user ? (
        <div className="flex flex-1 flex-col">
          <Button
            variant="ghost"
            onClick={() => sendTabsToRememr('single', true)}
            className="justify-start rounded-none"
          >
            Save this tab for reading later
          </Button>
          <Button variant="ghost" onClick={() => sendTabsToRememr('all', true)} className="justify-start rounded-none">
            Save all tabs for reading later
          </Button>
          {/* <DropdownMenuSeparator className="bg-foreground mx-0 my-0" />
          <Button
            variant="ghost"
            onClick={() => sendTabsToRememr('single', false)}
            className="justify-start rounded-none"
          >
            Save this tab with tags...
          </Button>
          <Button variant="ghost" onClick={() => sendTabsToRememr('all', false)} className="justify-start rounded-none">
            Save all tabs with tags...
          </Button> */}
        </div>
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
