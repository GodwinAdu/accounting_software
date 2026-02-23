import { Separator } from "@/components/ui/separator";
import { EstimateForm } from "../../new/_components/estimate-form";
import Heading from "@/components/commons/Header";
import { getEstimateById } from "@/lib/actions/estimate.action";
import { getCustomers } from "@/lib/actions/customer.action";
import { notFound } from "next/navigation";

export default async function EditEstimatePage({ params }: { params: Promise<{ estimateId: string }>}) {
  const { estimateId } = await params;
  const [estimateResult, customersResult] = await Promise.all([
    getEstimateById(estimateId),
    getCustomers(),
  ]);

  if (estimateResult.error || !estimateResult.data) {
    notFound();
  }

  const customers = customersResult.success && customersResult.data
    ? customersResult.data.map((c: any) => ({
        _id: c._id,
        name: c.name,
        company: c.company,
        email: c.email,
      }))
    : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Edit Estimate"
        description="Update estimate details"
      />
      <Separator />
      <EstimateForm initialData={estimateResult.data} customers={customers} />
    </div>
  );
}
