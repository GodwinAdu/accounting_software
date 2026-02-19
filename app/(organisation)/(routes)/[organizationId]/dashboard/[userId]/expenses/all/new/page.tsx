
import { Separator } from "@/components/ui/separator";
import { ExpenseForm } from "./_components/expense-form";
import Heading from "@/components/commons/Header";

export default function NewExpensePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Expense"
        description="Record a new business expense"
      />
      <Separator />
      <ExpenseForm />
    </div>
  );
}
