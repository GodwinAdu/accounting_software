import { Separator } from "@/components/ui/separator";
import { InvoiceForm } from "../../new/_components/invoice-form";
import Heading from "@/components/commons/Header";
import { getInvoiceById } from "@/lib/actions/invoice.action";
import { notFound } from "next/navigation";

export default async function EditInvoicePage({ params }: { params: { invoiceId: string } }) {
  const result = await getInvoiceById(params.invoiceId);

  if (result.error || !result.data) {
    notFound();
  }

  const invoice = result.data;

  if (invoice.status !== "draft") {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Edit Invoice"
        description="Update invoice details"
      />
      <Separator />
      <InvoiceForm initialData={invoice} />
    </div>
  );
}
