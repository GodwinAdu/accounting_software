import { notFound } from "next/navigation";
import { getCreditNoteById } from "@/lib/actions/credit-note.action";
import { CreditNoteForm } from "../../new/_components/credit-note-form";

export default async function EditCreditNotePage({
  params,
}: {
  params: Promise<{ creditNoteId: string }>;
}) {
  const {creditNoteId} = await params
  const result = await getCreditNoteById(creditNoteId);

  if (result.error || !result.data) {
    notFound();
  }

  return <CreditNoteForm initialData={result.data} />;
}
