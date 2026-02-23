import { Separator } from "@/components/ui/separator";
import { CustomerForm } from "../../new/_components/customer-form";
import Heading from "@/components/commons/Header";
import { getCustomerById } from "@/lib/actions/customer.action";
import { notFound } from "next/navigation";

export default async function EditCustomerPage({ params }: { params: Promise<{ customerId: string }> }) {
  const {customerId} = await params;
  const result = await getCustomerById(customerId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Edit Customer"
        description="Update customer details"
      />
      <Separator />
      <CustomerForm initialData={result.data} />
    </div>
  );
}
