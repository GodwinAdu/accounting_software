import { Separator } from "@/components/ui/separator";
import { ExpenseForm } from "./_components/expense-form";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Receipt } from "lucide-react";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export default async function NewExpensePage() {
  const user = await currentUser();
  const hasAIAccess = user ? await checkModuleAccess(String(user.organizationId), "ai") : false;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Expense"
        description="Record a new business expense"
      />
      <Separator />
      
      <Alert className="border-amber-200 bg-amber-50">
        <Receipt className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <span className="font-semibold">Remember:</span> Attach receipts for tax compliance. Mark as reimbursable if you need to be paid back. Expenses require approval before posting to accounts.
        </AlertDescription>
      </Alert>

      <ExpenseForm hasAIAccess={hasAIAccess} />
    </div>
  );
}
