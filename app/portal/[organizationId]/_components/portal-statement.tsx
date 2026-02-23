"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function PortalStatement({ invoices, payments, customer, organization }: any) {
  const transactions = [
    ...invoices.map((inv: any) => ({
      date: inv.invoiceDate || inv.date,
      type: "Invoice",
      reference: inv.invoiceNumber,
      debit: inv.totalAmount || inv.total || 0,
      credit: 0,
      balance: 0,
    })),
    ...payments.map((pay: any) => ({
      date: pay.paymentDate,
      type: "Payment",
      reference: pay.paymentNumber,
      debit: 0,
      credit: pay.amount || 0,
      balance: 0,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = 0;
  transactions.forEach((txn) => {
    runningBalance += txn.debit - txn.credit;
    txn.balance = runningBalance;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Account Statement</CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-muted-foreground text-xs">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Statement Period</p>
                  <p className="font-semibold">All Time</p>
                  <p className="text-muted-foreground text-xs">
                    As of {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 px-2 text-sm font-semibold">Date</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold">Type</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold">Reference</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold">Charges</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold">Payments</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">
                        {new Date(txn.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-sm">{txn.type}</td>
                      <td className="py-3 px-2 text-sm font-mono">{txn.reference}</td>
                      <td className="py-3 px-2 text-sm text-right">
                        {txn.debit > 0 ? `GHS ${txn.debit.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-emerald-600">
                        {txn.credit > 0 ? `GHS ${txn.credit.toLocaleString()}` : "-"}
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-semibold">
                        GHS {txn.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td colSpan={5} className="py-3 px-2 text-right">
                      Current Balance:
                    </td>
                    <td className={`py-3 px-2 text-right text-lg ${runningBalance > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                      GHS {Math.abs(runningBalance).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="py-2 px-2 text-right text-sm text-muted-foreground italic">
                      {runningBalance > 0 
                        ? `Amount owed by customer` 
                        : runningBalance < 0
                        ? `Credit balance - Customer has overpaid and can use this for future purchases`
                        : `Account is settled`
                      }
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
