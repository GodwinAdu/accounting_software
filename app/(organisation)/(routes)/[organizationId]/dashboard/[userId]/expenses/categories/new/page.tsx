import { Separator } from "@/components/ui/separator";
import { CategoryForm } from "./_components/category-form";
import Heading from "@/components/commons/Header";

export default function NewCategoryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Category"
        description="Create a new expense category"
      />
      <Separator />
      <CategoryForm />
    </div>
  );
}
