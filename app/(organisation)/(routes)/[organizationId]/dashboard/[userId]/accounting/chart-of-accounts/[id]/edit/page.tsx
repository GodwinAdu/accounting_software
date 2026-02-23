import { getAccountById } from "@/lib/actions/account.action";
import { AccountForm } from "../../new/_components/account-form";
import { redirect } from "next/navigation";

export default async function EditAccountPage({ params }: { params:Promise< { id: string; organizationId: string; userId: string }> }) {
  const {id, organizationId, userId } = await params
  const result = await getAccountById(id);

  if (!result.success || !result.data) {
    redirect(`/${organizationId}/dashboard/${userId}/accounting/chart-of-accounts`);
  }

  return <AccountForm initialData={result.data} />;
}
