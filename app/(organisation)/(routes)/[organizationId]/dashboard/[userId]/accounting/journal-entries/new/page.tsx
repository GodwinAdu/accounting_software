import { Separator } from "@/components/ui/separator";
import { JournalEntryForm } from "./_components/journal-entry-form";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { JournalEntrySuggestion } from "@/components/ai";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export default async function NewJournalEntryPage() {
  const user = await currentUser();
  const hasAIAccess = await checkModuleAccess(user?.organizationId!, "ai");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Journal Entry"
        description="Create a new accounting journal entry"
      />
      <Separator />
      
      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900 font-semibold">Double-Entry Bookkeeping</AlertTitle>
        <AlertDescription className="text-amber-800 mt-2">
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Critical Rule:</span> Total debits must equal total credits. The system will prevent posting unbalanced entries.</p>
            <p><span className="font-semibold">Tip:</span> Save as draft to review later, or post immediately to update the General Ledger. Posted entries cannot be edited—only reversed.</p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <JournalEntryForm />
        </div>
        {hasAIAccess && (
          <div>
            <JournalEntrySuggestion />
          </div>
        )}
      </div>
    </div>
  );
}
