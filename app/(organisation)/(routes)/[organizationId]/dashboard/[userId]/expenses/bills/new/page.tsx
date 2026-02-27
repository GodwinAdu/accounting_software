import { Separator } from "@/components/ui/separator";
import { BillForm } from "./_components/bill-form";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function NewBillPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Bill"
        description="Record a new vendor bill"
      />
      <Separator />
      
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <span className="font-semibold">Tip:</span> Save as draft to review later, or post to create accounts payable. Set payment terms to track due dates. Once posted, bills cannot be edited.
        </AlertDescription>
      </Alert>

      <BillForm />
    </div>
  );
}
