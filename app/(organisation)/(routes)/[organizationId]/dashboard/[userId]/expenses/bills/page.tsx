import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getBills } from "@/lib/actions/bill.action";
import { BillsList } from "./_components/bills-list";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BillsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("bills_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("bills_create");

  const result = await getBills();
  const bills = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Bills"
        description="Manage vendor bills and payables"
      />
      <Separator />
      
      <Alert className="border-blue-200 bg-blue-50">
        <FileText className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">Bills Management</AlertTitle>
        <AlertDescription className="text-blue-800 mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><span className="font-semibold">Draft bills</span> can be edited before posting</li>
            <li><span className="font-semibold">Posted bills</span> create accounts payable entries and cannot be edited</li>
            <li><span className="font-semibold">Payment terms</span> track when bills are due for payment</li>
            <li><span className="font-semibold">Partial payments</span> are supported - record multiple payments against one bill</li>
          </ul>
        </AlertDescription>
      </Alert>

      <BillsList bills={bills} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
