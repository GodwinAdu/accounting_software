import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import PageTemplate from "@/components/commons/PageTemplate";
import { Receipt } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ReceiptsPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <PageTemplate title="Sales Receipts" description="Manage sales receipts and cash sales" icon={<Receipt className="h-8 w-8" />} />;
}
