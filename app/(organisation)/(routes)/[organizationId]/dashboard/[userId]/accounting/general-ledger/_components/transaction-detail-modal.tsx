"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Hash, User, Building2, DollarSign, Clock } from "lucide-react";
import { format } from "date-fns";

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
}

export default function TransactionDetailModal({ open, onOpenChange, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null;

  console.log("transactions",transaction)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                Reference Number
              </p>
              <p className="font-medium">{transaction.referenceNumber || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Transaction Date
              </p>
              <p className="font-medium">
                {transaction.transactionDate 
                  ? format(new Date(transaction.transactionDate), "PPP")
                  : "N/A"}
              </p>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">
                    {transaction.accountId?.accountName || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Code: {transaction.accountId?.accountCode || "N/A"}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {transaction.accountId?.accountType || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transaction Amounts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Transaction Amounts</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Debit</p>
                {transaction.debit > 0 ? (
                  <p className="text-xl font-bold text-emerald-600">
                    GHS {transaction.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground">-</p>
                )}
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground mb-2">Credit</p>
                {transaction.credit > 0 ? (
                  <p className="text-xl font-bold text-blue-600">
                    GHS {transaction.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                ) : (
                  <p className="text-xl font-bold text-muted-foreground">-</p>
                )}
              </div>
              <div className="rounded-lg border p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground mb-2">Running Balance</p>
                <p className="text-xl font-bold">
                  GHS {(transaction.runningBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Journal Entry Info */}
          {transaction.journalEntryId && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold">Journal Entry</h3>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Number</p>
                      <p className="font-medium mt-1">
                        {transaction.journalEntryId?.entryNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Entry Type</p>
                      <Badge variant="secondary" className="mt-1">
                        {transaction.journalEntryId?.entryType || "N/A"}
                      </Badge>
                    </div>
                  </div>
                  {transaction.journalEntryId?.description && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm mt-1">{transaction.journalEntryId.description}</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Description */}
          {transaction.description && (
            <>
              <div className="space-y-2">
                <h3 className="font-semibold">Transaction Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed rounded-lg border p-4 bg-muted/50">
                  {transaction.description}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Additional Info */}
          <div className="space-y-3">
            <h3 className="font-semibold">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1">Transaction Type</p>
                <Badge variant="outline">
                  {transaction.debit > 0 ? "Debit" : "Credit"}
                </Badge>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1">Reconciliation Status</p>
                <Badge variant={transaction.isReconciled ? "default" : "secondary"}>
                  {transaction.isReconciled ? "Reconciled" : "Unreconciled"}
                </Badge>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1">Fiscal Year</p>
                <p className="font-medium">{transaction.fiscalYear || "N/A"}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-muted-foreground mb-1">Fiscal Period</p>
                <p className="font-medium">{transaction.fiscalPeriod || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Reference Info */}
          {transaction.referenceType && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Reference Information</h3>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Reference Type</p>
                      <Badge variant="outline" className="mt-1">
                        {transaction.referenceType}
                      </Badge>
                    </div>
                    {transaction.referenceNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Reference Number</p>
                        <p className="font-medium mt-1">{transaction.referenceNumber}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Created By */}
          {(transaction.journalEntryId?.createdBy || transaction.createdBy) && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Created By</h3>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-lg">
                        {transaction.journalEntryId?.createdBy?.fullName || 
                         transaction.createdBy?.fullName ||
                         "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.journalEntryId?.createdBy?.email || 
                         transaction.createdBy?.email || 
                         "No email"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Posted By */}
          {transaction.journalEntryId?.postedBy && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Posted By</h3>
                </div>
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-lg">
                        {transaction.journalEntryId.postedBy.fullName || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.journalEntryId.postedBy.email || "No email"}
                      </p>
                      {transaction.journalEntryId.postedDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Posted on {format(new Date(transaction.journalEntryId.postedDate), "PPp")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Timestamps */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Timestamps</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {transaction.createdAt && (
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1">Created At</p>
                  <p className="font-medium">
                    {format(new Date(transaction.createdAt), "PPp")}
                  </p>
                </div>
              )}
              {transaction.updatedAt && (
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(transaction.updatedAt), "PPp")}
                  </p>
                </div>
              )}
              {transaction.reconciledDate && (
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground mb-1">Reconciled Date</p>
                  <p className="font-medium">
                    {format(new Date(transaction.reconciledDate), "PPp")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
