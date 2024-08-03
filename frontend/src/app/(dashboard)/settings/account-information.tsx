'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { createClient } from '@/src/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'

const FormId = 'account-information-form'

const FormSchema = z.object({
  email: z.string().email(),
})

export const AccountInformation = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user.email,
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const supabase = createClient()
    // TODO: Wrap this in react-query
    const { data, error } = await supabase.auth.updateUser({ email: values.email })
    if (data) {
      toast.success('Account information updated')
    } else if (error) {
      toast.error(error.message)
    } else {
      toast.error('An unknown error occurred.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id={FormId} onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button type="submit" form={FormId}>
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
