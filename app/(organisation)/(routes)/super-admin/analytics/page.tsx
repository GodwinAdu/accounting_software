import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import User from "@/lib/models/user.model";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";
import { BarChart3, TrendingUp, Users, Building2 } from "lucide-react";

export default async function AnalyticsPage() {
  await checkSuperAdmin();
  await connectToDB();

  const [organizations, users, invoices, expenses] = await Promise.all([
    Organization.find({ del_flag: false }).lean(),
    User.find({ del_flag: false }).lean(),
    Invoice.find({ del_flag: false }).lean(),
    Expense.find({ del_flag: false }).lean(),
  ]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  // Monthly growth
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const newOrgsThisMonth = organizations.filter(org => {
    const created = new Date(org.createdAt);
    return created.getMonth() === thisMonth && created.getFullYear() === thisYear;
  }).length;

  // Subscription breakdown
  const subscriptionBreakdown = organizations.reduce((acc: any, org) => {
    const plan = org.subscriptionPlan || "free";
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  // Active vs inactive
  const activeOrgs = organizations.filter(org => org.status === "active").length;
  const inactiveOrgs = organizations.length - activeOrgs;

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Overview of platform performance and metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">+{newOrgsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Across all organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total invoiced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((activeOrgs / organizations.length) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{activeOrgs} active organizations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Subscription Plans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(subscriptionBreakdown).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between">
                  <span className="capitalize font-medium">{plan}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${((count as number) / organizations.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold w-12 text-right">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Organization Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span className="font-medium">Active</span>
                </div>
                <span className="text-2xl font-bold">{activeOrgs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span className="font-medium">Inactive</span>
                </div>
                <span className="text-2xl font-bold">{inactiveOrgs}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Organizations by Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organizations
              .map(org => {
                const orgInvoices = invoices.filter(inv => inv.organizationId.toString() === org._id.toString());
                const revenue = orgInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                return { ...org, revenue };
              })
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 10)
              .map((org: any) => (
                <div key={org._id.toString()} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.industry || "N/A"}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">GHS {org.revenue.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
