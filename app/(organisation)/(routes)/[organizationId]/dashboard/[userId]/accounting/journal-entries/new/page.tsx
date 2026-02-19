import { Separator } from "@/components/ui/separator";
import { JournalEntryForm } from "./_components/journal-entry-form";
import Heading from "@/components/commons/Header";

export default function NewJournalEntryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Journal Entry"
        description="Create a new accounting journal entry"
      />
      <Separator />
      <JournalEntryForm />
    </div>
  );
}
