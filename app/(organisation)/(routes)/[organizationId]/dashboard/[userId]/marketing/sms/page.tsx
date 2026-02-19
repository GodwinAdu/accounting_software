import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getSMSCampaigns } from "@/lib/actions/sms-campaign.action";
import { getCustomers } from "@/lib/actions/customer.action";
import { getEmployees } from "@/lib/actions/employee.action";
import Link from "next/link";
import SendCampaignButton from "../email/_components/send-campaign-button";
import SMSCampaignModal from "./_components/sms-campaign-modal";

export default async function SMSCampaignsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const [campaignsResult, customersResult, employeesResult] = await Promise.all([
    getSMSCampaigns(),
    getCustomers(),
    getEmployees(),
  ]);

  const campaigns = campaignsResult.data || [];
  const customers = customersResult.data || [];
  const employees = employeesResult.data || [];

  const totalSent = campaigns.filter((c: any) => c.status === "sent").length;
  const totalDraft = campaigns.filter((c: any) => c.status === "draft").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="SMS Campaigns"
          description="Create and manage SMS marketing campaigns"
        />
        <SMSCampaignModal customers={customers} employees={employees} />
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{totalSent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalDraft}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign: any) => (
          <Card key={campaign._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="line-clamp-1">{campaign.message}</CardDescription>
                  </div>
                </div>
                <Badge variant={campaign.status === "sent" ? "default" : "secondary"}>
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>Sent: {campaign.stats.sent}</span>
                  <span>Delivered: {campaign.stats.delivered}</span>
                  <span>Failed: {campaign.stats.failed}</span>
                </div>
                <div className="flex gap-2">
                  {campaign.status === "draft" && (
                    <SendCampaignButton campaignId={campaign._id} type="sms" />
                  )}
                  <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms/${campaign._id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
