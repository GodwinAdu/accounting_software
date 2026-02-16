
import { Separator } from "@/components/ui/separator";
import { InvoiceForm } from "./_components/invoice-form";
import Heading from "@/components/commons/Header";

export default function NewInvoicePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Create Invoice"
        description="Generate a new invoice for your customer"
      />
      <Separator />
      <InvoiceForm />
    </div>
  );
}
