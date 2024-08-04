'use client'

import { Button } from '@/src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { createClient } from '@/src/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormId = 'login-form'

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const supabase = createClient()
    // TODO: Wrap this in react-query
    await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    router.push('/')
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form id={FormId} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="m@example.com" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your password" {...field} autoComplete="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div>
        <Button type="submit" className="w-full" form={FormId}>
          Login
        </Button>
        {/* <Button variant="outline" className="w-full">
              Login with Google
            </Button> */}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}
