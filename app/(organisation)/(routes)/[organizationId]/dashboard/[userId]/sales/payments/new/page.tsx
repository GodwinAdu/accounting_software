import { Separator } from "@/components/ui/separator";
import { PaymentForm } from "./_components/payment-form";
import Heading from "@/components/commons/Header";

export default function NewPaymentPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Record Payment"
        description="Record a payment received from a customer"
      />
      <Separator />
      <PaymentForm />
    </div>
  );
}
