import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Calendar } from "lucide-react";
import { OrgActionsMenu } from "./_components/org-actions-menu";

export default async function OrganizationsPage() {
  await checkSuperAdmin();
  await connectToDB();

  const organizations = await Organization.find({ del_flag: false })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="text-muted-foreground">Manage all organizations on the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Organizations ({organizations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org: any) => (
                <TableRow key={org._id.toString()}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-muted-foreground">{org.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{org.industry || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={org.isActive ? "bg-emerald-600" : "bg-gray-500"}>
                      {org.isActive ? "active" : "inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{org.subscriptionPlan?.plan || "free"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(org.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrgActionsMenu orgId={org._id.toString()} currentStatus={org.isActive ? "active" : "inactive"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
