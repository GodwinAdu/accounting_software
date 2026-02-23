import { Separator } from "@/components/ui/separator";
import { LoanForm } from "./_components/loan-form";
import Heading from "@/components/commons/Header";

export default function NewLoanPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Loan"
        description="Add a new loan to your register"
      />
      <Separator />
      <LoanForm />
    </div>
  );
}
