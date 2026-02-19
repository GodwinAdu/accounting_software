import { Separator } from "@/components/ui/separator";
import { RecurringExpenseForm } from "./_components/recurring-expense-form";
import Heading from "@/components/commons/Header";

export default function NewRecurringExpensePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Recurring Expense"
        description="Set up a recurring expense schedule"
      />
      <Separator />
      <RecurringExpenseForm />
    </div>
  );
}
