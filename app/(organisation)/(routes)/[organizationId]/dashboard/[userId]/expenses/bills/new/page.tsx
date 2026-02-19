import { Separator } from "@/components/ui/separator";
import { BillForm } from "./_components/bill-form";
import Heading from "@/components/commons/Header";

export default function NewBillPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Bill"
        description="Record a new vendor bill"
      />
      <Separator />
      <BillForm />
    </div>
  );
}
