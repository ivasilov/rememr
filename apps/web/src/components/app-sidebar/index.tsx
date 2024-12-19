'use server'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@rememr/ui'
import { Home, Inbox, Tag } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/server'
import { SidebarMenuLink } from './sidebar-menu-link'

export async function AppSidebar() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: tags } = await supabase.from('tags').select('*').order('name', { ascending: false })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">rememr</span>
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuLink href="/bookmarks" size="default">
                  <Home />
                  <span>All bookmarks</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuLink href="/bookmarks/unread">
                  <Inbox />
                  <span>Reading list</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tags</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tags?.map(t => (
                <SidebarMenuItem key={t.id}>
                  <SidebarMenuLink href={`/tags/${t.id}`} className="align-center flex items-center">
                    <Tag />
                    <span>{t.name}</span>
                  </SidebarMenuLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
