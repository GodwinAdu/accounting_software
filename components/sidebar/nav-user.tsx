"use client"

import {
  ChevronsUpDown,
  DockIcon,
  Key,
  Keyboard,
  Settings,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useParams } from "next/navigation"
import { dayLeft } from "@/lib/utils"
import Link from "next/link"
import { ModeToggle } from "../theme/mode-toggle"


export function NavUser({ organization }: { organization: any }) {
  const { isMobile } = useSidebar()
  const params = useParams()

  const {organizationId,userId} = params;
  
  if (!organization?.name) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="school-avatar" asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src='' alt={organization.name} />
                <AvatarFallback className="rounded-lg">{organization.name?.toUpperCase().slice(0, 2) || 'OR'}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{organization.name}</span>
                <span className="truncate text-xs text-red-400 font-extrabold">Expired : {dayLeft(organization?.subscriptionPlan?.expiryDate)} days left</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src='' alt={organization.name} />
                  <AvatarFallback className="rounded-lg">{organization.name?.toUpperCase().slice(0, 2) || 'OR'}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{organization.name}</span>
                  <span className="text-primary font-extrabold">{organization.subscriptionPlan?.plan} plan</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <div className="flex gap-2 items-center">
                <ModeToggle />
                <p className="font-extrabold">Theme</p>
              </div>
              <Link href={`/${organizationId}/admin/${userId}/api-key`}>
                <DropdownMenuItem>
                  <Key />
                  Api Management
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/admin/${userId}/keyboard-shortcuts`}>
                <DropdownMenuItem>
                  <Keyboard />
                  Keyboard shortcuts
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/admin/${userId}/school-settings`}>
                <DropdownMenuItem>
                  <Settings />
                  Organization Settings
                </DropdownMenuItem>
              </Link>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <PaymentDialog organization={organization} />
              <RatingDialog /> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}