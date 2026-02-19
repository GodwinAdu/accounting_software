import { redirect } from "next/navigation";

export default async function GeneralLedgerReportPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;
  redirect(`/${organizationId}/dashboard/${userId}/accounting/general-ledger`);
}
