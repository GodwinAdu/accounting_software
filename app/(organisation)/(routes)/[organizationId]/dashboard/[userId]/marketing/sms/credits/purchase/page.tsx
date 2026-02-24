"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initializePayment } from "@/lib/actions/paystack.action";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function PurchaseSMSCreditsPage({
  params,
}: {
  params: { organizationId: string; userId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const defaultCredits = parseInt(searchParams.get("credits") || "200");
  const defaultAmount = parseFloat(searchParams.get("amount") || "15");

  const isCustom = searchParams.get("custom") === "true";
  const amount = isCustom ? parseFloat(customAmount) || 0 : defaultAmount;
  const credits = isCustom ? Math.floor(amount * 20) : defaultCredits;

  const handlePurchase = async () => {
    if (isCustom && (!customAmount || amount <= 0)) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const result = await initializePayment(credits, amount);

      if (result.success && result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        toast.error(result.error || "Payment initialization failed");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Payment initialization failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
        <CardHeader>
          <CardTitle>Purchase SMS Credits</CardTitle>
          <CardDescription>
            {isCustom ? "Enter your custom amount" : "Complete your purchase to get SMS credits"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isCustom ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (GHS)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 20"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You will receive {credits} credits (GHS 1 = 20 credits)
                  </p>
                </div>
              </div>
              {amount > 0 && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Credits</span>
                    <span className="text-2xl font-bold">{credits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold">GHS {amount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Credits</span>
                <span className="text-2xl font-bold">{credits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold">GHS {amount}</span>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground text-center mb-4">
              You will be redirected to Paystack to complete your payment securely
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay GHS ${amount}`
              )}
            </Button>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
