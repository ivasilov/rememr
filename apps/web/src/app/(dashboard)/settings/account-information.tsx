'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

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
    const { data, error } = await supabase.auth.updateUser({
      email: values.email,
    })
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
          <form
            className="w-2/3 space-y-6"
            id={FormId}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your email"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button form={FormId} type="submit">
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
