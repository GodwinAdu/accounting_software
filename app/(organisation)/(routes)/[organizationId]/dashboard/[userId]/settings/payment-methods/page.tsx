import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/commons/Header";
import PaymentMethodsTabs from "./_components/payment-methods-tabs";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PaymentMethodsPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <Heading
          title="Payment Methods"
          description="Configure how you receive payments from customers"
        />
      </div>
      <Separator />
      <PaymentMethodsTabs organizationId={organizationId} userId={userId} />
    </div>
  );
}
