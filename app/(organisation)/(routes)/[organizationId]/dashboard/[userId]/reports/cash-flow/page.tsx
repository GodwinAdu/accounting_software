import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getCashFlow } from "@/lib/actions/report.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function CashFlowPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getCashFlow();
  const data = result.data || {};

  const {
    operatingActivities = [],
    investingActivities = [],
    financingActivities = [],
    operatingCash = 0,
    investingCash = 0,
    financingCash = 0,
    netCashFlow = 0,
  } = data;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Cash Flow Statement"
          description="Statement of cash flows"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Operating Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {operatingActivities.length > 0 ? (
                operatingActivities.map((activity: any, i: number) => (
                  <div key={i} className="flex justify-between py-2">
                    <span>{activity.description}</span>
                    <span className={`font-medium ${activity.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      GHS {activity.amount >= 0 ? activity.amount.toLocaleString() : `(${Math.abs(activity.amount).toLocaleString()})`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No operating activities</p>
              )}
              <div className="flex justify-between py-2 font-bold text-lg border-t pt-2">
                <span>Net Cash from Operating Activities</span>
                <span className={operatingCash >= 0 ? "text-emerald-600" : "text-red-600"}>
                  GHS {operatingCash >= 0 ? operatingCash.toLocaleString() : `(${Math.abs(operatingCash).toLocaleString()})`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investing Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {investingActivities.length > 0 ? (
                investingActivities.map((activity: any, i: number) => (
                  <div key={i} className="flex justify-between py-2">
                    <span>{activity.description}</span>
                    <span className={`font-medium ${activity.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      GHS {activity.amount >= 0 ? activity.amount.toLocaleString() : `(${Math.abs(activity.amount).toLocaleString()})`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No investing activities</p>
              )}
              <div className="flex justify-between py-2 font-bold text-lg border-t pt-2">
                <span>Net Cash from Investing Activities</span>
                <span className={investingCash >= 0 ? "text-emerald-600" : "text-red-600"}>
                  GHS {investingCash >= 0 ? investingCash.toLocaleString() : `(${Math.abs(investingCash).toLocaleString()})`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financing Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {financingActivities.length > 0 ? (
                financingActivities.map((activity: any, i: number) => (
                  <div key={i} className="flex justify-between py-2">
                    <span>{activity.description}</span>
                    <span className={`font-medium ${activity.amount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      GHS {activity.amount >= 0 ? activity.amount.toLocaleString() : `(${Math.abs(activity.amount).toLocaleString()})`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4">No financing activities</p>
              )}
              <div className="flex justify-between py-2 font-bold text-lg border-t pt-2">
                <span>Net Cash from Financing Activities</span>
                <span className={financingCash >= 0 ? "text-emerald-600" : "text-red-600"}>
                  GHS {financingCash >= 0 ? financingCash.toLocaleString() : `(${Math.abs(financingCash).toLocaleString()})`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-600">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Net Change in Cash</span>
              <span className={`text-3xl font-bold ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                GHS {netCashFlow >= 0 ? netCashFlow.toLocaleString() : `(${Math.abs(netCashFlow).toLocaleString()})`}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
