import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getSMSCredits, getSMSUsageHistory, getPurchaseHistory } from "@/lib/actions/sms-credit.action";
import { Coins, TrendingUp, TrendingDown, ShoppingCart, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { UsageHistory, PurchaseHistory } from "./_components/history-lists";

export default async function SMSCreditsPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { organizationId, userId } = await params;
  const { payment } = await searchParams;

  const [creditsResult, usageResult, purchaseResult] = await Promise.all([
    getSMSCredits(),
    getSMSUsageHistory(1, 20),
    getPurchaseHistory(1, 20),
  ]);

  const credits = creditsResult.data || { balance: 0, totalEarned: 0, totalSpent: 0 };
  const usage = usageResult.data || [];
  const purchases = purchaseResult.data || [];

  const packages = [
    { credits: 100, price: 5, popular: false },
    { credits: 300, price: 12, popular: false },
    { credits: 600, price: 20, popular: true },
    { credits: 1500, price: 50, popular: false },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms`}>
        <Button variant="ghost" className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to SMS Campaigns
        </Button>
      </Link>
      <div className="flex items-center justify-between">
        <Heading title="SMS Credits" description="Manage your SMS credits and usage" />
        <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms/credits/purchase`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </Link>
      </div>
      <Separator />

      {payment === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Your SMS credits have been added to your account.
          </AlertDescription>
        </Alert>
      )}

      {payment === "failed" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Payment failed. Please try again or contact support.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-600" />
              Available Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{credits.balance}</div>
            <p className="text-xs text-muted-foreground mt-1">SMS messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{credits.totalEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">Credits received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{credits.totalSpent}</div>
            <p className="text-xs text-muted-foreground mt-1">Credits used</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {packages.map((pkg) => (
          <Card key={pkg.credits} className={pkg.popular ? "border-emerald-600 border-2" : ""}>
            <CardHeader>
              {pkg.popular && (
                <Badge className="w-fit mb-2 bg-emerald-600">Most Popular</Badge>
              )}
              <CardTitle className="text-2xl">{pkg.credits}</CardTitle>
              <CardDescription>SMS Credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">GHS {pkg.price}</div>
              <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms/credits/purchase?credits=${pkg.credits}&amount=${pkg.price}`}>
                <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                  Purchase
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Amount</CardTitle>
          <CardDescription>Purchase any amount - GHS 1 = 20 credits</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms/credits/purchase?custom=true`}>
            <Button variant="outline" className="w-full">
              Enter Custom Amount
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <UsageHistory initialData={usage} initialPagination={usageResult.pagination} />
        <PurchaseHistory initialData={purchases} initialPagination={purchaseResult.pagination} />
      </div>
    </div>
  );
}
