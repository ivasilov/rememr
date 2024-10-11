import '@rememr/ui/globals.css'

import { Button } from '@rememr/ui'
import { browser } from 'browser-namespace'
import { useEffect, useState } from 'react'
import { supabase } from '~core/supabase'

function IndexPopup() {
  // the popup defaults to being logged in because is the more common usecase (than being logged out). This is to avoid
  // rerendering on each opening when the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (!data || error) {
        setIsLoggedIn(false)
        console.error(error)
      }
    })
  }, [])

  const sendTabsToRememr = async (tabCount: 'single' | 'all', readLater: boolean) => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (!user || userError) {
        throw userError
      }

      const tabs = await browser.tabs.query({ currentWindow: true, ...(tabCount === 'all' ? {} : { active: true }) })
      const bookmarks = tabs
        .filter(tab => tab.url && tab.title)
        .map(tab => ({
          user_id: user.id,
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
      {isLoggedIn ? (
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
        <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-4">
          <p className="text-sm font-semibold">
            You need to login to your Rememr account to be able to save your tabs.
          </p>
          <Button variant="default" onClick={() => browser.runtime.openOptionsPage()}>
            Login on rememr.com
          </Button>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
