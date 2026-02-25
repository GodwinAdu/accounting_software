import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getVATReturnData } from "@/lib/actions/vat-return.action";
import VATReturnClient from "./_components/vat-return-client";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function VATReturnPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasPermission = await checkPermission("tax_view");
  if (!hasPermission) redirect("/unauthorized");

  const result = await getVATReturnData();
  const data = result.data || {
    outputVAT: 0,
    inputVAT: 0,
    netVAT: 0,
    salesByRate: [],
    purchasesByRate: [],
    invoices: [],
    expenses: [],
  };

  return <VATReturnClient data={data} organizationId={organizationId} userId={userId} />;
}
