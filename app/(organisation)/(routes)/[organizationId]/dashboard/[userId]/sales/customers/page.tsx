import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import CustomersList from "./_components/customers-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CustomersPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Customers"
        description="Manage your customer database"
      />
      <Separator />
      <CustomersList organizationId={organizationId} userId={userId} />
    </div>
  );
}
