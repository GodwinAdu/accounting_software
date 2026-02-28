import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import User from "@/lib/models/user.model";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2, Users, DollarSign, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrganizationActions } from "./_components/organization-actions";

export default async function OrganizationDetailPage({ params }: { params: Promise<{ orgId: string }> }) {
  await checkSuperAdmin();
  await connectToDB();
  
  const { orgId } = await params;

  const [organization, users, invoices, expenses] = await Promise.all([
    Organization.findById(orgId).lean(),
    User.find({ organizationId: orgId, del_flag: false }).lean(),
    Invoice.find({ organizationId: orgId, del_flag: false }).lean(),
    Expense.find({ organizationId: orgId, del_flag: false }).lean(),
  ]);

  if (!organization) notFound();

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/super-admin/organizations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">Organization Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">GHS {totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">GHS {totalExpenses.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={organization.isActive ? "bg-emerald-600" : "bg-gray-500"}>
                    {organization.isActive ? "active" : "inactive"}
                  </Badge>

                  <span className="text-muted-foreground">Subscription:</span>
                  <Badge variant="outline">{organization.subscriptionPlan?.plan || "free"}</Badge>

                  <span className="text-muted-foreground">Industry:</span>
                  <span>{organization.industry || "N/A"}</span>

                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{organization.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {organization.address?.street || organization.address?.city 
                      ? `${organization.address.street || ""} ${organization.address.city || ""} ${organization.address.country || ""}`.trim()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organization Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user._id.toString()}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={user.status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <OrganizationActions 
            orgId={orgId} 
            currentStatus={organization.isActive ? "active" : "inactive"} 
            currentPlan={organization.subscriptionPlan?.plan || "starter"}
            enabledModules={Object.keys(organization.modules || {}).filter(key => organization.modules[key as keyof typeof organization.modules])}
          />
        </div>
      </div>
    </div>
  );
}
