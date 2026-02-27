import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

export default function NewAccountPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Account"
        description="Add a new account to your chart of accounts"
      />
      <Separator />
      
      <Alert className="border-purple-200 bg-purple-50">
        <Lightbulb className="h-4 w-4 text-purple-600" />
        <AlertTitle className="text-purple-900 font-semibold">Account Setup Tips</AlertTitle>
        <AlertDescription className="text-purple-800 mt-2">
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Account Code:</span> Use a numbering system (e.g., 1000-1999 for Assets, 2000-2999 for Liabilities)</p>
            <p><span className="font-semibold">Account Type:</span> Choose carefully - this determines how the account behaves in reports</p>
            <p><span className="font-semibold">Parent Account:</span> Create sub-accounts under main accounts for better organization</p>
            <p><span className="font-semibold">System Accounts:</span> Cannot be deleted or modified (e.g., Retained Earnings, Opening Balance)</p>
          </div>
        </AlertDescription>
      </Alert>

      <AccountForm />
    </div>
  );
}
