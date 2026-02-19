import { redirect } from "next/navigation";

export default function CRMPage({ params }: { params: { organizationId: string; userId: string } }) {
  redirect(`/${params.organizationId}/dashboard/${params.userId}/crm/leads`);
}
