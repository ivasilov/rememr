'use client'

import { Avatar as AvatarPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '../lib/utils'

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn('size-8 relative flex shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn('size-full aspect-square', className)} {...props} />
  )
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted size-full flex items-center justify-center rounded-full', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
