import { Separator } from "@/components/ui/separator";
import { EquityForm } from "./_components/equity-form";
import Heading from "@/components/commons/Header";

export default function NewEquityPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Equity Transaction"
        description="Record owner investment, drawing, or dividend"
      />
      <Separator />
      <EquityForm />
    </div>
  );
}
