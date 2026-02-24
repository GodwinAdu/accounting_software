"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSMSUsageHistory, getPurchaseHistory } from "@/lib/actions/sms-credit.action";
import { Gift, ShoppingCart, MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UsageHistory({ initialData, initialPagination }: any) {
  const [usage, setUsage] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const result = await getSMSUsageHistory(pagination.page + 1, 20);
    if (result.success) {
      setUsage([...usage, ...result.data]);
      setPagination(result.pagination);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Usage History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {usage.length > 0 ? (
            <>
              {usage.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.type === "bonus" && <Gift className="h-4 w-4 text-blue-600" />}
                    {item.type === "purchase" && <ShoppingCart className="h-4 w-4 text-green-600" />}
                    {item.type === "send" && <MessageSquare className="h-4 w-4 text-orange-600" />}
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.amount > 0 ? "+" : ""}{item.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">Balance: {item.balance}</p>
                  </div>
                </div>
              ))}
              {pagination.hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load More"}
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No usage history yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function PurchaseHistory({ initialData, initialPagination }: any) {
  const [purchases, setPurchases] = useState(initialData);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const result = await getPurchaseHistory(pagination.page + 1, 20);
    if (result.success) {
      setPurchases([...purchases, ...result.data]);
      setPagination(result.pagination);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Purchase History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {purchases.length > 0 ? (
            <>
              {purchases.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.credits} Credits</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">GHS {item.amount}</p>
                    <Badge variant="outline" className="text-xs">{item.status}</Badge>
                  </div>
                </div>
              ))}
              {pagination.hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load More"}
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No purchases yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
