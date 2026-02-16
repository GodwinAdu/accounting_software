import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import EstimatesList from "./_components/estimates-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function EstimatesPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Estimates"
        description="Create and manage customer estimates"
      />
      <Separator />
      <EstimatesList organizationId={organizationId} userId={userId} />
    </div>
  );
}
