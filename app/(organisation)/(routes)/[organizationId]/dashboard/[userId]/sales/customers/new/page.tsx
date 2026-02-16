
import { Separator } from "@/components/ui/separator";
import { CustomerForm } from "./_components/customer-form";
import Heading from "@/components/commons/Header";

export default function NewCustomerPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Add New Customer"
        description="Create a new customer profile for your business"
      />
      <Separator />
      <CustomerForm />
    </div>
  );
}
