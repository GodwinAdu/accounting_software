import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getEmailCampaigns } from "@/lib/actions/email-campaign.action";
import Link from "next/link";
import SendCampaignButton from "./_components/send-campaign-button";

export default async function EmailCampaignsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const campaignsResult = await getEmailCampaigns();
  const campaigns = campaignsResult.data || [];

  const totalSent = campaigns.filter((c: any) => c.status === "sent").length;
  const totalDraft = campaigns.filter((c: any) => c.status === "draft").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Email Campaigns"
          description="Create and manage email marketing campaigns"
        />
        <Link href={`/${organizationId}/dashboard/${userId}/marketing/email/new`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
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
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.subject}</CardDescription>
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
                  <span>Opened: {campaign.stats.opened}</span>
                </div>
                <div className="flex gap-2">
                  {campaign.status === "draft" && (
                    <SendCampaignButton campaignId={campaign._id} type="email" />
                  )}
                  <Link href={`/${organizationId}/dashboard/${userId}/marketing/email/${campaign._id}`}>
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
