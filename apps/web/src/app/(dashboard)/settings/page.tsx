'use server'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rememr/ui'
import { MainContentLayout } from '@/components/main-content-layout'
import { createClient } from '@/lib/supabase/server'
import { AccountInformation } from './account-information'
import { Imports } from './imports'

const AccountPage = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <MainContentLayout>
      <h1 className="font-semibold text-3xl">Settings</h1>
      <div className="mx-auto grid w-full items-start gap-4 md:gap-8">
        <AccountInformation user={user} />
        <Card>
          <CardHeader>
            <CardTitle>Import bookmarks from other sources</CardTitle>
            <CardDescription>
              You can use the built-in importers to import bookmarks from other
              apps.
            </CardDescription>
            {/* TODO: Add a link for requesting importers from other apps */}
          </CardHeader>
          <CardContent className="flex flex-row gap-3">
            <Imports />
          </CardContent>
        </Card>
      </div>
    </MainContentLayout>
  )
}

export default AccountPage
