
import { Separator } from "@/components/ui/separator";
import { EstimateForm } from "./_components/estimate-form";
import Heading from "@/components/commons/Header";

export default function NewEstimatePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Create Estimate"
        description="Generate a new estimate/quote for your customer"
      />
      <Separator />
      <EstimateForm />
    </div>
  );
}
