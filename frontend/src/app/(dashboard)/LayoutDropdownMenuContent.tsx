'use client'

import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSeparator } from '@/src/components/ui/dropdown-menu'
import { createClient } from '@/src/utils/supabase/client'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const LayoutDropdownMenuContent = () => {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.refresh()
  }, [router, supabase.auth])

  console.log(theme)

  return (
    <>
      <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={() => setTheme('light')}>
        Light
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={() => setTheme('dark')}>
        Dark
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={() => setTheme('system')}>
        System
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/settings">Settings</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
    </>
  )
}
