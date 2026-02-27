import { Separator } from "@/components/ui/separator";
import { InvoiceForm } from "./_components/invoice-form";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export default async function NewInvoicePage() {
  const user = await currentUser();
  const hasAIAccess = user ? await checkModuleAccess(String(user.organizationId), "ai") : false;

  return (
    <>
      <Heading
        title="Create Invoice"
        description="Generate a new invoice for your customer"
      />
      <Separator />
      
      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <span className="font-semibold">Tip:</span> Save as draft to edit later, or send directly to post to accounting records. Once sent, invoices cannot be edited.
        </AlertDescription>
      </Alert>

      <InvoiceForm hasAIAccess={hasAIAccess} />
    </>
  );
}
