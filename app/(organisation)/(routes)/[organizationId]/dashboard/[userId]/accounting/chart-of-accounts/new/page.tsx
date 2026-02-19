import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form";
import Heading from "@/components/commons/Header";

export default function NewAccountPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Account"
        description="Add a new account to your chart of accounts"
      />
      <Separator />
      <AccountForm />
    </div>
  );
}
