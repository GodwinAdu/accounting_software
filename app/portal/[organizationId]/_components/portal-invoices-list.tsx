"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, CreditCard, Eye } from "lucide-react";
import { useState } from "react";
import InvoiceDetailsDialog from "./invoice-details-dialog";

export default function PortalInvoicesList({ invoices, settings, organizationId }: any) {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice: any) => (
                <div key={invoice._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                        {invoice.status === "overdue" && (
                          <Badge className="bg-red-100 text-red-700">Action Required</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Issue Date: {new Date(invoice.date).toLocaleDateString()}</p>
                        <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        <p className="font-semibold text-foreground">
                          Amount: GHS {(invoice.total || invoice.totalAmount || 0).toLocaleString()}
                        </p>
                        {(invoice.amountPaid || invoice.paidAmount || 0) > 0 && (
                          <p className="text-emerald-600">
                            Paid: GHS {(invoice.amountPaid || invoice.paidAmount || 0).toLocaleString()}
                          </p>
                        )}
                        {((invoice.total || invoice.totalAmount || 0) - (invoice.amountPaid || invoice.paidAmount || 0)) > 0 && (
                          <p className="text-orange-600 font-semibold">
                            Balance: GHS {((invoice.total || invoice.totalAmount || 0) - (invoice.amountPaid || invoice.paidAmount || 0)).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(invoice)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {settings.features?.downloadDocuments && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {settings.features?.makePayments && invoice.status !== "paid" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <InvoiceDetailsDialog 
        invoice={selectedInvoice} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen}
        organizationId={organizationId}
      />
    </>
  );
}
