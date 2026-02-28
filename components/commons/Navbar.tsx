"use client";

import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import FullScreenButton from "./FullScreen";
import UserDropdown from "./user-dropdown";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "../ui/button";

const Navbar = ({ user, pro }: { user: IEmployee; pro: boolean }) => {
    const isSuperAdmin = user?.role === "super_admin";

    console.log(isSuperAdmin,"super admin")

    return (
        <header
            className="flex w-full sticky top-0 z-50 bg-background h-14 sm:h-16 border-b shrink-0 items-center gap-2 shadow-md transition-[width,height] ease-linear"
        >
            <div className="flex items-center gap-2 toggle pl-2 sm:pl-0">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
            </div>

            <div className="dashboard-stats flex gap-2 sm:gap-4 ml-auto items-center pr-2 sm:pr-10">
                {isSuperAdmin && (
                    <Link href="/super-admin/dashboard">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Super Admin</span>
                        </Button>
                    </Link>
                )}
                
                <div className="fullscreen hidden sm:block">
                    <FullScreenButton />
                </div>
                <div className="profile">
                    <UserDropdown
                        email={user?.email}
                        username={user?.fullName}
                        avatarUrl={user?.imgUrl as string}
                        notificationCount={100}
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;