'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User, Lock, HelpCircle, Keyboard, Shield, CreditCard, Building2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { logout } from '@/lib/helpers/session'
import { ModeToggle } from '../theme/mode-toggle'
import { useParams} from 'next/navigation'


interface UserDropdownProps {
  username: string
  avatarUrl: string
  email: string
  notificationCount?: number
}

export default function UserDropdown({ username, avatarUrl, email, notificationCount = 0 }: UserDropdownProps) {

  const params = useParams()
  const {organizationId,userId} = params
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout("/");
      toast.success('Logged Out',{
        description: 'You have been successfully logged out.',
      })

    } catch {
      toast.error('Error logging out',{
        description: 'Failed to log out. Please try again.',
      })
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
        {notificationCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-4 min-w-4 px-1 bg-emerald-600 hover:bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full"
          >
            {notificationCount}
          </Badge>
        )}
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
          <Avatar className="h-9 w-9 border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold">
              {username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72 shadow-xl rounded-lg p-2"
          align="end"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar className="h-12 w-12 border-2 border-emerald-500/20">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold text-lg">
                  {username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-base truncate">{username}</span>
                <span className="text-sm text-muted-foreground truncate">
                  {email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <MenuItem icon={User} label="My Profile" href={`/${organizationId}/dashboard/${userId}/profile`} />
            <MenuItem icon={Building2} label="Company Settings" href={`/${organizationId}/dashboard/${userId}/settings/company`} />
            <MenuItem icon={Settings} label="Preferences" href={`/${organizationId}/dashboard/${userId}/settings/preferences` } />
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <div className="flex gap-2 items-center px-3 py-2">
              <ModeToggle />
              <span className="text-sm font-medium">Theme</span>
            </div>
            <MenuItem icon={Keyboard} label="Keyboard Shortcuts" href={`/${organizationId}/dashboard/${userId}/settings/shortcuts`} />
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <MenuItem icon={CreditCard} label="Billing & Subscription" href={`/${organizationId}/dashboard/${userId}/settings/company?tab=subscription` } />
            <MenuItem icon={Shield} label="Security" href={`/${organizationId}/dashboard/${userId}/settings/company?tab=security`} />
            <MenuItem icon={Lock} label="Change Password" href={`/${organizationId}/dashboard/${userId}/settings/password}`} />
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <MenuItem icon={HelpCircle} label="Help & Support" href={`/${organizationId}/dashboard/${userId}/help`} />
            <MenuItem icon={Bell} label="What's New" href="/changelog" />
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


function MenuItem({ icon: Icon, label, onClick, disabled, href }: { icon: LucideIcon; label: string; onClick?: () => void; disabled?: boolean; href?: string }) {
  const content = (
    <>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </>
  )

  if (href) {
    return (
      <Link href={href}>
        <DropdownMenuItem disabled={disabled} className="cursor-pointer">
          {content}
        </DropdownMenuItem>
      </Link>
    )
  }

  return (
    <DropdownMenuItem disabled={disabled} onClick={onClick} className="cursor-pointer">
      {content}
    </DropdownMenuItem>
  )
}