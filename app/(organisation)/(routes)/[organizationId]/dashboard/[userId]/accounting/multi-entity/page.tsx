import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, DollarSign, FileText } from "lucide-react";
import { getMultiEntityData } from "@/lib/actions/multi-entity.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function MultiEntityPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("multiEntity_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getMultiEntityData();
  if (!result.success) {
    return <div>Error loading data</div>;
  }

  const { entities, totalEntities, totalRevenue, interCompanyThisMonth, pendingEliminations } = result.data;

  return (
    <div className="space-y-6">
      <Heading title="Multi-Entity Consolidation" description="Manage multiple entities and consolidate financials" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntities}</div>
            <p className="text-xs text-muted-foreground mt-1">Active entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consolidated Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All entities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inter-company Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interCompanyThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elimination Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEliminations}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entity Management</CardTitle>
        </CardHeader>
        <CardContent>
          {entities.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No entities configured</p>
              <p className="text-sm text-muted-foreground mt-2">Add entities to start consolidating financials</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entities.map((org: any) => (
                <div key={org._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-muted-foreground">{org.organizationCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={org._id === organizationId ? "default" : "outline"}>
                      {org._id === organizationId ? "Current" : "Active"}
                    </Badge>
                    <Badge variant="secondary">{org.subscriptionPlan.plan}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
