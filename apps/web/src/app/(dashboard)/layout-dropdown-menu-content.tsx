import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type SettingsGearHandle,
  SettingsGearIcon,
} from '@rememr/ui'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export const LayoutDropdownMenuContent = () => {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const supabase = createClient()
  const settingsGearRef = useRef<SettingsGearHandle>(null)

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    queryClient.clear()
    await navigate({ to: '/auth/login', replace: true })
  }, [navigate, queryClient, supabase.auth])

  return (
    <>
      <DropdownMenuCheckboxItem
        checked={theme === 'light'}
        onCheckedChange={() => setTheme('light')}
      >
        Light
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme('dark')}
      >
        Dark
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={theme === 'system'}
        onCheckedChange={() => setTheme('system')}
      >
        System
      </DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link
          onMouseEnter={() => settingsGearRef.current?.startAnimation()}
          onMouseLeave={() => settingsGearRef.current?.stopAnimation()}
          to="/settings"
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
