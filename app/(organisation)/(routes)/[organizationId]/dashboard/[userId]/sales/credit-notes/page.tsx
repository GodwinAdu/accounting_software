import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getCreditNotes } from "@/lib/actions/credit-note.action";
import CreditNotesList from "./_components/credit-notes-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CreditNotesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("creditNotes_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("creditNotes_create");

  const result = await getCreditNotes();
  const creditNotes = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading title="Credit Notes" description="Issue credit notes for refunds and adjustments" />
      <Separator />
      <CreditNotesList creditNotes={creditNotes} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
