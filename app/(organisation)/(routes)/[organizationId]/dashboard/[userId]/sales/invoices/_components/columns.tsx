"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Wallet, Mail } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteInvoice } from "@/lib/actions/invoice.action";
import { CellAction } from "@/components/table/cell-action";
import { RecordPaymentModal } from "@/components/payment/record-payment-modal";
import { AIEmailModal } from "./ai-email-modal";
import { useAIEmailAccess } from "./ai-email-context";

export type Invoice = {
  _id: string;
  id: string;
  invoiceNumber: string;
  customer: string;
  customerName?: string;
  customerEmail?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  balance: number;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("invoiceNumber")}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue<number>("balance");
      return (
        <div className={balance > 0 ? "font-semibold text-orange-600" : "text-muted-foreground"}>
          GHS {balance.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
        sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
        paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
        overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
        cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      const params = useParams();
      const pathname = usePathname();
      const segments = pathname.split('/');
      const orgId = segments[1];
      const userId = segments[3];
      const [showPaymentModal, setShowPaymentModal] = useState(false);
      const [showEmailModal, setShowEmailModal] = useState(false);
      const [emailType, setEmailType] = useState<"payment_reminder" | "thank_you" | "overdue_notice">("payment_reminder");
      const { hasAIAccess } = useAIEmailAccess();

      const actions = [];

      // Add AI Email action for sent/overdue/paid invoices (only if AI enabled)
      if (hasAIAccess) {
        if (invoice.status === "sent" || invoice.status === "overdue") {
          actions.push({
            label: "Send Reminder",
            type: "custom" as const,
            icon: <Mail className="h-4 w-4" />,
            permissionKey: "invoices_view",
            onClick: () => {
              setEmailType(invoice.status === "overdue" ? "overdue_notice" : "payment_reminder");
              setShowEmailModal(true);
            },
          });
        }

        if (invoice.status === "paid") {
          actions.push({
            label: "Thank You Email",
            type: "custom" as const,
            icon: <Mail className="h-4 w-4" />,
            permissionKey: "invoices_view",
            onClick: () => {
              setEmailType("thank_you");
              setShowEmailModal(true);
            },
          });
        }
      }

      // Add Pay action for sent/overdue invoices
      if (invoice.status === "sent" || invoice.status === "overdue") {
        actions.push({
          label: "Record Payment",
          type: "custom" as const,
          icon: <Wallet className="h-4 w-4" />,
          permissionKey: "invoices_view",
          onClick: () => setShowPaymentModal(true),
        });
      }

      // Add Edit action for draft invoices
      if (invoice.status === "draft") {
        actions.push({
          label: "Edit",
          type: "edit" as const,
          icon: <Edit className="h-4 w-4" />,
          permissionKey: "invoices_update",
          href: `/${orgId}/dashboard/${userId}/sales/invoices/${invoice._id}/edit`,
        });
      }

      // Add Delete action
      actions.push({
        label: "Delete",
        type: "delete" as const,
        icon: <Trash2 className="h-4 w-4" />,
        permissionKey: "invoices_delete",
      });

      return (
        <>
          <CellAction
            data={invoice}
            actions={actions}
            onDelete={async (id) => {
              const result = await deleteInvoice(id, pathname);
              if (result.error) throw new Error(result.error);
            }}
          />
          <RecordPaymentModal
            open={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            invoiceId={invoice._id}
            amount={invoice.balance}
            currency="GHS"
            customerEmail={invoice.customerEmail || ""}
          />
          <AIEmailModal
            open={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            type={emailType}
            recipientName={invoice.customerName || invoice.customer}
            recipientEmail={invoice.customerEmail}
            amount={invoice.amount}
            invoiceNumber={invoice.invoiceNumber}
            dueDate={invoice.dueDate}
          />
        </>
      );
    },
  },
];
