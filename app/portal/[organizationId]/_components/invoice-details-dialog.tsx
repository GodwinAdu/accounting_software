"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function InvoiceDetailsDialog({ invoice, open, onOpenChange, organizationId }: any) {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
      partial: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Details</DialogTitle>
            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Invoice Number</p>
              <p className="font-semibold">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Issue Date</p>
              <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Terms</p>
              <p className="font-semibold">{invoice.paymentTerms || "Net 30"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Items</h3>
            <div className="space-y-2">
              {invoice.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-2">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity} × GHS {(item.unitPrice || item.rate || 0).toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold">GHS {(item.amount || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">GHS {(invoice.subtotal || 0).toLocaleString()}</span>
            </div>
            {(invoice.tax || invoice.taxAmount || 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">GHS {(invoice.tax || invoice.taxAmount || 0).toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">GHS {(invoice.total || invoice.totalAmount || 0).toLocaleString()}</span>
            </div>
            {(invoice.amountPaid || invoice.paidAmount || 0) > 0 && (
              <>
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Amount Paid</span>
                  <span className="font-semibold">GHS {(invoice.amountPaid || invoice.paidAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span className="font-semibold">Balance Due</span>
                  <span className="text-xl font-bold">GHS {((invoice.total || invoice.totalAmount || 0) - (invoice.amountPaid || invoice.paidAmount || 0)).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{invoice.notes}</p>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {invoice.status !== "paid" && (
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
