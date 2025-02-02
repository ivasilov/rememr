'use server'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
} from '@rememr/ui'
import { ChevronDown, FileStack, Home, Inbox, Tag } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { createClient } from '../../utils/supabase/server'
import { SidebarMenuLink } from './sidebar-menu-link'

function EmptyResults({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground border-border bg-muted/50 mx-2 flex items-center justify-center rounded-md border border-dashed py-4 text-sm">
      {message}
    </div>
  )
}

export async function AppSidebar() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: tags, error } = await supabase
    .from('bookmarks_tags')
    .select('...tags(id,name), bookmark_id.count()')
    .eq('tags.user_id', user.id)
    .order('name', { ascending: false, referencedTable: 'tags' })

  const { data: sessions } = await supabase
    .from('bookmarks_sessions')
    .select('...sessions(id,name), bookmark_id.count()')
    .eq('sessions.user_id', user.id)
    .order('created_at', { ascending: false, referencedTable: 'sessions' })

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href="/bookmarks" className="flex items-center gap-2 font-semibold">
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
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Sessions
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sessions?.map(t => (
                    <SidebarMenuItem key={t.id}>
                      <SidebarMenuLink href={`/sessions/${t.id}`} className="align-center flex items-center">
                        <FileStack />
                        <span className="w-44 truncate">{t.name}</span>
                      </SidebarMenuLink>
                      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Tags
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tags?.map(t => (
                    <SidebarMenuItem key={t.id}>
                      <SidebarMenuLink href={`/tags/${t.id}`} className="align-center flex items-center">
                        <Tag />
                        <span className="w-44 truncate">{t.name}</span>
                      </SidebarMenuLink>
                      <SidebarMenuBadge>{t.count}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}
