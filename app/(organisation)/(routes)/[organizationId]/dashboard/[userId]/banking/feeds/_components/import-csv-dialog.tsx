"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { importBankFeed } from "@/lib/actions/bank-feed.action";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImportCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

export default function ImportCSVDialog({ open, onOpenChange, accounts }: ImportCSVDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(line => line.trim());
    const transactions = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
      if (values.length >= 3) {
        const amount = parseFloat(values[2]);
        transactions.push({
          date: values[0],
          description: values[1],
          amount: Math.abs(amount),
          type: amount >= 0 ? "deposit" : "withdrawal",
          reference: values[3] || undefined,
        });
      }
    }

    return transactions;
  };

  const handleImport = async () => {
    if (!selectedAccount || !file) {
      toast.error("Please select account and file");
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const transactions = parseCSV(text);

      if (transactions.length === 0) {
        toast.error("No valid transactions found in CSV");
        setLoading(false);
        return;
      }

      const result = await importBankFeed({
        bankAccountId: selectedAccount,
        transactions,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `Import complete! ${result.data.imported} imported, ${result.data.duplicates} duplicates skipped, ${result.data.errors} errors`
        );
        setFile(null);
        setSelectedAccount("");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to import CSV");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Bank Statement (CSV)
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with your bank transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              CSV format: Date, Description, Amount, Reference (optional)
              <br />
              Example: 2024-01-15, Customer Payment, 5000, REF123
            </AlertDescription>
          </Alert>

          <div>
            <Label>Select Bank Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Choose account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.bankName} - {acc.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Upload CSV File</Label>
            <div className="mt-2">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
            {file && (
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedAccount || !file || loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Importing..." : "Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
