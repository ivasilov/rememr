import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import { supabase } from '~core/supabase'

function IndexOptions() {
  const [user, setUser] = useStorage<User>({
    key: 'user',
    instance: new Storage({
      area: 'local',
    }),
  })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)
        sendToBackground({
          name: 'init-session',
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token,
          },
        })
      }
    }

    init()
  }, [])

  const handleEmailLogin = async (username: string, password: string) => {
    try {
      const {
        error,
        data: { user },
      } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })

      if (error) {
        alert('Error with auth: ' + error.message)
      } else {
        setUser(user)
      }
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        top: 240,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 240,
          justifyContent: 'space-between',
          gap: 4.2,
        }}
      >
        {user && (
          <>
            <h3>
              {user.email} - {user.id}
            </h3>
            <button
              onClick={() => {
                supabase.auth.signOut()
                setUser(null)
              }}
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <label>Email</label>
            <input
              type="text"
              placeholder="Your Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <button
              onClick={e => {
                handleEmailLogin(username, password)
              }}
            >
              Login
            </button>
          </>
        )}
      </div>
    </main>
  )
}

export default IndexOptions
