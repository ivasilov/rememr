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
  SidebarMenuItem,
} from '@rememr/ui'
import type { User } from '@supabase/supabase-js'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Home, Inbox } from 'lucide-react'
import { SessionsMenu } from './sessions-menu'
import { SidebarMenuLink } from './sidebar-menu-link'
import { TagsMenu } from './tags-menu'

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link
            className="flex items-center gap-2 font-semibold"
            to="/bookmarks"
          >
            <span className="">rememr</span>
          </Link>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuLink size="default" to="/bookmarks">
                  <Home />
                  <span>All bookmarks</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuLink to="/bookmarks/unread">
                  <Inbox />
                  <span>Reading list</span>
                </SidebarMenuLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible className="group/collapsible" defaultOpen>
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
                  <SessionsMenu user={user} />
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible className="group/collapsible" defaultOpen>
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
                  <TagsMenu user={user} />
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}
