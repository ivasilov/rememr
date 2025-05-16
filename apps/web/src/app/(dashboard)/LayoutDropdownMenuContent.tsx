'use client'

import { createClient } from '@/utils/supabase/client'
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  SettingsGearHandle,
  SettingsGearIcon,
} from '@rememr/ui'
import { LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

export const LayoutDropdownMenuContent = () => {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()
  const settingsGearRef = useRef<SettingsGearHandle>(null)

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    router.refresh()
  }, [router, supabase.auth])

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
        <Link
          href="/settings"
          onMouseEnter={() => settingsGearRef.current?.startAnimation()}
          onMouseLeave={() => settingsGearRef.current?.stopAnimation()}
        >
          <SettingsGearIcon ref={settingsGearRef} />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={signOut}>
        <LogOut />
        <span>Sign out</span>
      </DropdownMenuItem>
    </>
  )
}
