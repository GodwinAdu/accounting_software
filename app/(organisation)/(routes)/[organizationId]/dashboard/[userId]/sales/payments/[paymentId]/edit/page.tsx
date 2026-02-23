import { Separator } from "@/components/ui/separator";
import { PaymentForm } from "../../new/_components/payment-form";
import Heading from "@/components/commons/Header";
import { getPaymentById } from "@/lib/actions/payment.action";
import { notFound } from "next/navigation";

export default async function EditPaymentPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const result = await getPaymentById(paymentId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Edit Payment"
        description="Update payment details"
      />
      <Separator />
      <PaymentForm initialData={result.data} />
    </div>
  );
}
