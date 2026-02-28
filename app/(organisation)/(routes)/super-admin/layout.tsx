import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import Link from "next/link";
import { Building2, Users, BarChart3, Settings, LayoutDashboard } from "lucide-react";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  await checkSuperAdmin();

  const navItems = [
    { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/super-admin/organizations", label: "Organizations", icon: Building2 },
    { href: "/super-admin/users", label: "Users", icon: Users },
    { href: "/super-admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/super-admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-lg font-bold">Super Admin</h2>
          <p className="text-xs text-muted-foreground">Platform Management</p>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
