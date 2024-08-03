'use server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { checkAuthentication } from '@/src/lib/supabase'
import { createClient } from '@/src/utils/supabase/server'
import { cookies } from 'next/headers'
import { AccountInformation } from './account-information'
import { Imports } from './imports'

const AccountPage = async () => {
  await checkAuthentication()
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto mt-8 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
        <AccountInformation user={user} />
        <Card>
          <CardHeader>
            <CardTitle>Import bookmarks from other sources</CardTitle>
            <CardDescription>You can use the built-in importers to import bookmarks from other apps.</CardDescription>
            {/* TODO: Add a link for requesting importers from other apps */}
          </CardHeader>
          <CardContent className="flex flex-row gap-3">
            <Imports />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AccountPage
