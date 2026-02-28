import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import User from "@/lib/models/user.model";
import Invoice from "@/lib/models/invoice.model";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function SuperAdminDashboard() {
  await checkSuperAdmin();
  await connectToDB();

  const [totalOrgs, totalUsers, activeOrgs, invoices, recentOrgs] = await Promise.all([
    Organization.countDocuments({ del_flag: false }),
    User.countDocuments({ del_flag: false }),
    Organization.countDocuments({ del_flag: false, status: "active" }),
    Invoice.find({ del_flag: false }).lean(),
    Organization.find({ del_flag: false }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const newOrgsThisMonth = await Organization.countDocuments({
    del_flag: false,
    createdAt: {
      $gte: new Date(thisYear, thisMonth, 1),
      $lt: new Date(thisYear, thisMonth + 1, 1),
    },
  });

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all organizations and platform settings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrgs}</div>
            <p className="text-xs text-emerald-600">+{newOrgsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeOrgs}</div>
            <p className="text-xs text-muted-foreground">{((activeOrgs / totalOrgs) * 100).toFixed(1)}% active rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total invoiced</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrgs.map((org: any) => (
                <Link
                  key={org._id.toString()}
                  href={`/super-admin/organizations/${org._id}`}
                  className="flex items-center justify-between p-3 border rounded hover:bg-muted transition"
                >
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(org.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={org.status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
                    {org.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span className="text-sm font-medium">Avg Users per Org</span>
              <span className="text-lg font-bold">{(totalUsers / totalOrgs).toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span className="text-sm font-medium">Total Invoices</span>
              <span className="text-lg font-bold">{invoices.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded">
              <span className="text-sm font-medium">Avg Revenue per Org</span>
              <span className="text-lg font-bold">GHS {(totalRevenue / totalOrgs).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Link href="/super-admin/organizations" className="p-4 border rounded-lg hover:bg-muted transition">
            <Building2 className="h-8 w-8 mb-2 text-blue-600" />
            <h3 className="font-semibold">Manage Organizations</h3>
            <p className="text-sm text-muted-foreground">View and manage all organizations</p>
          </Link>
          <Link href="/super-admin/users" className="p-4 border rounded-lg hover:bg-muted transition">
            <Users className="h-8 w-8 mb-2 text-purple-600" />
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View all platform users</p>
          </Link>
          <Link href="/super-admin/analytics" className="p-4 border rounded-lg hover:bg-muted transition">
            <BarChart3 className="h-8 w-8 mb-2 text-emerald-600" />
            <h3 className="font-semibold">View Analytics</h3>
            <p className="text-sm text-muted-foreground">Platform performance metrics</p>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
