import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import PageTemplate from "@/components/commons/PageTemplate";
import { DollarSign } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PaymentsPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <PageTemplate title="Payments Received" description="Track and manage customer payments" icon={<DollarSign className="h-8 w-8" />} />;
}
