import type { User } from '@supabase/supabase-js'
import { browser } from 'browser-namespace'
import { useEffect, useState } from 'react'
import { supabase } from '~core/supabase'
import '~style.css'

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

  const sendTabsToRememr = async (allTabs: boolean) => {
    setIsLoading(true)
    try {
      const tabs = await browser.tabs.query({ currentWindow: true, ...(allTabs ? {} : { active: true }) })
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

  return (
    <div className="flex h-48 w-64 flex-col items-center justify-center space-y-4 p-4">
      {user ? (
        <>
          <button
            onClick={() => sendTabsToRememr(false)}
            disabled={isLoading}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Send this tab to rememr.com
          </button>
          <button
            onClick={() => sendTabsToRememr(true)}
            disabled={isLoading}
            className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          >
            Send all tabs to rememr.com
          </button>
        </>
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
