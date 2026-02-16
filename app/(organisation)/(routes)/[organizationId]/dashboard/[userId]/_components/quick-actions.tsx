"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Receipt, DollarSign, BarChart3, Users, ShoppingCart, Calculator, Building2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePermissions } from "@/lib/hooks/use-permissions";

export default function QuickActions() {
  const params = useParams();
  const organizationId = params.organizationId as string;
  const userId = params.userId as string;
  const { hasPermission, loading } = usePermissions();

  const actions = [
    {
      label: "Create Invoice",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/sales/invoices/new`,
      color: "text-blue-600",
      bg: "bg-blue-100",
      permission: "invoices_create",
    },
    {
      label: "Add Expense",
      icon: Receipt,
      href: `/${organizationId}/dashboard/${userId}/expenses/all/new`,
      color: "text-red-600",
      bg: "bg-red-100",
      permission: "expenses_create",
    },
    {
      label: "Run Payroll",
      icon: DollarSign,
      href: `/${organizationId}/dashboard/${userId}/payroll/run`,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      permission: "runPayroll_create",
    },
    {
      label: "View Reports",
      icon: BarChart3,
      href: `/${organizationId}/dashboard/${userId}/reports/profit-loss`,
      color: "text-purple-600",
      bg: "bg-purple-100",
      permission: "reports_view",
    },
    {
      label: "Add Customer",
      icon: Users,
      href: `/${organizationId}/dashboard/${userId}/sales/customers/new`,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      permission: "customers_create",
    },
    {
      label: "Add Product",
      icon: ShoppingCart,
      href: `/${organizationId}/dashboard/${userId}/products/new`,
      color: "text-orange-600",
      bg: "bg-orange-100",
      permission: "products_create",
    },
    {
      label: "Add Vendor",
      icon: Building2,
      href: `/${organizationId}/dashboard/${userId}/expenses/vendors/new`,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      permission: "vendors_create",
    },
    {
      label: "Tax Calculator",
      icon: Calculator,
      href: `/${organizationId}/dashboard/${userId}/tax/settings`,
      color: "text-pink-600",
      bg: "bg-pink-100",
      permission: "taxSettings_view",
    },
  ];

  // Filter actions based on permissions
  const allowedActions = actions.filter(action => hasPermission(action.permission));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {allowedActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4">
                <div className={`rounded-full p-2 ${action.bg}`}>
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
