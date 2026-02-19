
import { Separator } from "@/components/ui/separator";
import { RecurringInvoiceForm } from "./_components/recurring-invoice-form";
import Heading from "@/components/commons/Header";

export default function NewRecurringInvoicePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Recurring Invoice Profile"
        description="Set up automatic invoice generation on a recurring schedule"
      />
      <Separator />
      <RecurringInvoiceForm />
    </div>
  );
}
