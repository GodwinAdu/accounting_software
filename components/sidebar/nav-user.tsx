"use client"

import {
  ChevronsUpDown,
  Key,
  Keyboard,
  Settings,
  User,
  Bell,
  HelpCircle,
  LogOut,
  CreditCard,
  Shield,
  Building2,
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
import { Badge } from "@/components/ui/badge"


export function NavUser({ organization }: { organization: any }) {
  const { isMobile } = useSidebar()
  const params = useParams()

  const {organizationId,userId} = params;
  
  if (!organization?.name) {
    return null;
  }

  const daysLeft = dayLeft(organization?.subscriptionPlan?.expiryDate);
  const isExpiringSoon = daysLeft <= 7;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="school-avatar" asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-accent/50 transition-colors"
            >
              <Avatar className="h-8 w-8 rounded-lg border-2 border-emerald-500/20">
                <AvatarImage src='' alt={organization.name} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold">{organization.name?.toUpperCase().slice(0, 2) || 'OR'}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{organization.name}</span>
                <span className={`truncate text-xs font-semibold ${isExpiringSoon ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {daysLeft} days left
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 text-left">
                <Avatar className="h-10 w-10 rounded-lg border-2 border-emerald-500/20">
                  <AvatarImage src='' alt={organization.name} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold">{organization.name?.toUpperCase().slice(0, 2) || 'OR'}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-base">{organization.name}</span>
                  <Badge variant="secondary" className="w-fit mt-1 text-xs">
                    {organization.subscriptionPlan?.plan || 'Free'} Plan
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <Link href={`/${organizationId}/dashboard/${userId}/settings/company`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  Company Profile
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/dashboard/${userId}/settings/users`}>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  User Management
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/dashboard/${userId}/settings/integrations`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <div className="flex gap-2 items-center px-2 py-2">
                <ModeToggle />
                <span className="text-sm font-medium">Theme</span>
              </div>
              <Link href={`/${organizationId}/admin/${userId}/keyboard-shortcuts`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <Link href={`/${organizationId}/dashboard/${userId}/subscription`}>
                <DropdownMenuItem className="cursor-pointer">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscription & Billing
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/admin/${userId}/api-key`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Key className="mr-2 h-4 w-4" />
                  API Management
                </DropdownMenuItem>
              </Link>
              <Link href={`/${organizationId}/dashboard/${userId}/settings/audit-logs`}>
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  Security & Audit
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <Link href="/support">
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
              </Link>
              <Link href="/documentation">
                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  What's New
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <Link href="/api/auth/logout">
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}