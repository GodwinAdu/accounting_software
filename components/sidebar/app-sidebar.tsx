"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavUser } from "./nav-user"
import SideContent from "./sidebar"



interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organization: any,
  userRole: IRole,
  user:IEmployee
}

export function AppSidebar(props: AppSidebarProps) {
  const { organization, user, userRole, ...rest } = props;

  return (
    <Sidebar collapsible="icon" {...rest}>
      <SidebarHeader>
        <TeamSwitcher user={user}  />
      </SidebarHeader>
      <SidebarContent className="scrollbar-hide">
        <SideContent organization={organization} role={userRole?.permissions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser organization={organization} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}