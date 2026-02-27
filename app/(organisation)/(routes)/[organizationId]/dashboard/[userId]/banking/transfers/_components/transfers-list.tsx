"use client";

import { Plus, ArrowLeftRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TransferDialog from "./transfer-dialog";
import { deleteBankTransfer } from "@/lib/actions/bank-transfer.action";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface TransfersListProps {
  accounts: any[];
  transfers: any[];
  hasCreatePermission: boolean;
}

export default function TransfersList({ accounts, transfers, hasCreatePermission }: TransfersListProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const activeAccounts = accounts.filter(a => a.isActive);
  const totalBalance = activeAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transfer? This will reverse the account balances.")) return;
    
    setDeleting(id);
    try {
      const result = await deleteBankTransfer(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Transfer deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete transfer");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for transfers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCreatePermission && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transfer History</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Transfer
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No transfers yet. Transfer funds between your bank accounts.</p>
              {hasCreatePermission && (
                <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  Create Your First Transfer
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer: any) => (
                <Card key={transfer._id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="rounded-full p-3 bg-blue-100">
                          <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{transfer.transferNumber}</h3>
                            <Badge variant={transfer.status === "completed" ? "secondary" : "outline"}>
                              {transfer.status}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">
                              From: <span className="font-medium text-foreground">{transfer.fromAccountId?.accountName}</span>
                            </p>
                            <p className="text-muted-foreground">
                              To: <span className="font-medium text-foreground">{transfer.toAccountId?.accountName}</span>
                            </p>
                            <p className="text-lg font-bold text-emerald-600 mt-2">
                              GHS {transfer.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transfer.transferDate).toLocaleDateString("en-GB")}
                            </p>
                            {transfer.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{transfer.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(transfer._id)}
                        disabled={deleting === transfer._id}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TransferDialog open={dialogOpen} onOpenChange={setDialogOpen} accounts={activeAccounts} />
    </div>
  );
}
