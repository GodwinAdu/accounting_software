import { Separator } from "@/components/ui/separator";
import { AssetForm } from "./_components/asset-form";
import Heading from "@/components/commons/Header";

export default function NewAssetPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Fixed Asset"
        description="Add a new fixed asset to your register"
      />
      <Separator />
      <AssetForm />
    </div>
  );
}
