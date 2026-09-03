import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rememr/ui'
import { createFileRoute } from '@tanstack/react-router'
import { AccountInformation } from '@/app/(dashboard)/settings/account-information'
import { Imports } from '@/app/(dashboard)/settings/imports'
import { MainContentLayout } from '@/components/main-content-layout'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { user } = Route.useRouteContext()

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
          </CardHeader>
          <CardContent className="flex flex-row gap-3">
            <Imports />
          </CardContent>
        </Card>
      </div>
    </MainContentLayout>
  )
}
