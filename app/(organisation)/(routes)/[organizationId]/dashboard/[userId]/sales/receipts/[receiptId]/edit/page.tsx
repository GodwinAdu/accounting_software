import { notFound } from "next/navigation";
import { getReceiptById } from "@/lib/actions/receipt.action";
import { ReceiptForm } from "../../new/_components/receipt-form";

export default async function EditReceiptPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  
  const { receiptId } = await params;

  const result = await getReceiptById(receiptId);

  if (result.error || !result.data) {
    notFound();
  }

  return <ReceiptForm initialData={result.data} />;
}
