"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Hash, User, Building2 } from "lucide-react";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
}

export default function TransactionDetailModal({ open, onOpenChange, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Reference
              </p>
              <p className="font-medium">{transaction.reference}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </p>
              <p className="font-medium">{transaction.date}</p>
            </div>
          </div>

          <Separator />

          {/* Account Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Account Information</h3>
            </div>
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="font-medium text-lg">{transaction.account}</p>
              <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
            </div>
          </div>

          <Separator />

          {/* Transaction Amounts */}
          <div className="space-y-3">
            <h3 className="font-semibold">Transaction Amounts</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Debit</p>
                {transaction.debit > 0 ? (
                  <p className="text-xl font-bold text-emerald-600">
                    GHS {transaction.debit.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground">-</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Credit</p>
                {transaction.credit > 0 ? (
                  <p className="text-xl font-bold text-blue-600">
                    GHS {transaction.credit.toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground">-</p>
                )}
              </div>
              <div className="rounded-lg border p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-2">Running Balance</p>
                <p className="text-xl font-bold">
                  GHS {transaction.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Transaction Type</p>
                <Badge variant="outline" className="mt-1">
                  {transaction.debit > 0 ? "Debit" : "Credit"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant="secondary" className="mt-1">
                  Posted
                </Badge>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {transaction.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {transaction.description}
                </p>
              </div>
            </>
          )}

          {/* Created By */}
          {transaction.createdBy && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Created By</h3>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="font-medium">
                    {transaction.createdBy.firstName} {transaction.createdBy.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {transaction.createdBy.email}
                  </p>
                  {transaction.createdAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
