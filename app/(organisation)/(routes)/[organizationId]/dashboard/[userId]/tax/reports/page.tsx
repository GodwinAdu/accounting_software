import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { TaxDeductions } from "@/components/ai";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TaxReportsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;
  const user = await currentUser();
  const hasAIAccess = await checkModuleAccess(user?.organizationId!, "ai");

  const hasViewPermission = await checkPermission("tax_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const taxReports = [
    {
      id: "1",
      title: "Tax Summary Report",
      description: "Comprehensive tax overview including VAT, PAYE, and SSNIT",
      icon: FileText,
      color: "text-emerald-600",
      link: `/${organizationId}/dashboard/${userId}/reports/tax-summary`,
    },
    {
      id: "2",
      title: "VAT Return Summary",
      description: "Monthly VAT return with output and input VAT breakdown",
      icon: FileText,
      color: "text-blue-600",
      link: `/${organizationId}/dashboard/${userId}/tax/sales-tax`,
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Tax Reports"
          description="Generate and download tax compliance reports"
        />
      </div>
      <Separator />

      {hasAIAccess && (
        <div className="grid gap-4">
          <TaxDeductions />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {taxReports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                </div>
                <CardDescription className="mt-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={report.link}>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
