"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recalculateAccountBalances } from "@/lib/actions/reconciliation.action";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

export function RecalculateButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleRecalculate = async () => {
    setLoading(true);
    const result = await recalculateAccountBalances(pathname);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.data?.message || "Balances recalculated successfully");
      router.refresh();
    }
  };

  return (
    <Button onClick={handleRecalculate} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
      <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Recalculating..." : "Recalculate All Balances"}
    </Button>
  );
}
