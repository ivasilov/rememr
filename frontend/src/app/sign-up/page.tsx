'use client'

import { Input } from '@/src/components/ui/input'
import { createClient } from '@/src/utils/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SignUp() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sndPassword, setSndPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== sndPassword) {
      return
    }

    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    router.push('/sign-up?success')
  }
  const signUpSuccess = searchParams.has('success')

  return (
    <div className="flex h-screen flex-row justify-center py-12">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        {signUpSuccess ? (
          <div className="flex h-screen flex-row justify-center py-12">
            <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
              <p className="text-foreground text-center">
                Check <span className="font-bold">{email}</span> to continue signing up
              </p>
            </div>
          </div>
        ) : (
          <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2" onSubmit={handleSignUp}>
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <Input name="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="you@example.com" />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              name="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
            />
            <Input
              type="password"
              name="sndPassword"
              onChange={e => setSndPassword(e.target.value)}
              value={sndPassword}
              placeholder="••••••••"
            />

            <>
              <button className="mb-6 rounded bg-green-700 px-4 py-2 text-white">Sign Up</button>
              <p className="text-center text-sm">
                Already have an account?
                <Link href="/login" className="ml-1 underline">
                  Sign in now
                </Link>
              </p>
            </>
          </form>
        )}
      </div>
    </div>
  )
}
