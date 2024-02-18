'use client'

import { Input } from '@/src/components/ui/input'
import { createClient } from '@/src/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.push('/')
  }

  return (
    <div className="flex h-screen flex-row justify-center py-12">
      <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
        <form className="text-foreground flex w-full flex-1 flex-col justify-center gap-2" onSubmit={handleSignIn}>
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

          <>
            <button className="mb-6 rounded bg-green-700 px-4 py-2 text-white">Sign In</button>
            <p className="text-center text-sm">
              Don&apos;t have an account?
              <Link href="/sign-up" className="ml-1 underline">
                Sign up now
              </Link>
            </p>
          </>
        </form>
      </div>
    </div>
  )
}
