
import { Separator } from "@/components/ui/separator";
import { ReceiptForm } from "./_components/receipt-form";
import Heading from "@/components/commons/Header";

export default function NewReceiptPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Sales Receipt"
        description="Create a receipt for cash sales or immediate payments"
      />
      <Separator />
      <ReceiptForm />
    </div>
  );
}
