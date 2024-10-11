import '@rememr/ui/globals.css'

import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'
import { useStorage } from '@plasmohq/storage/hook'

import { Button, Input, Label } from '@rememr/ui'
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
    <main className="align-center flex h-screen items-center justify-center">
      <div className="flex h-fit flex-col gap-4">
        {user && (
          <>
            <h3>
              {user.email} - {user.id}
            </h3>
            <Button
              onClick={() => {
                supabase.auth.signOut()
                setUser(null)
              }}
            >
              Logout
            </Button>
          </>
        )}
        {!user && (
          <>
            <div>
              <Label>Email</Label>
              <Input
                type="text"
                placeholder="Your Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>

              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button onClick={() => handleEmailLogin(username, password)}>Login</Button>
          </>
        )}
      </div>
    </main>
  )
}

export default IndexOptions
