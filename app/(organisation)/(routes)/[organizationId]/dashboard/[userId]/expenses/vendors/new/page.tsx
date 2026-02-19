import { Separator } from "@/components/ui/separator";
import { VendorForm } from "./_components/vendor-form";
import Heading from "@/components/commons/Header";

export default function NewVendorPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Vendor"
        description="Add a new vendor to your records"
      />
      <Separator />
      <VendorForm />
    </div>
  );
}
