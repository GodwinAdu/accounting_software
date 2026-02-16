"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data
const mockUnreconciledTransactions = [
  { id: "1", date: "2024-01-15", description: "Client Payment - ABC Corp", amount: 15000, type: "credit", matched: false },
  { id: "2", date: "2024-01-14", description: "Office Rent Payment", amount: 5000, type: "debit", matched: false },
  { id: "3", date: "2024-01-13", description: "Payroll - January 2024", amount: 32000, type: "debit", matched: false },
  { id: "4", date: "2024-01-12", description: "Consulting Services", amount: 8500, type: "credit", matched: false },
];

const mockBankStatementItems = [
  { id: "b1", date: "2024-01-15", description: "CREDIT - ABC CORP", amount: 15000, matched: false },
  { id: "b2", date: "2024-01-14", description: "DEBIT - RENT PAYMENT", amount: 5000, matched: false },
  { id: "b3", date: "2024-01-13", description: "DEBIT - PAYROLL JAN", amount: 32000, matched: false },
  { id: "b4", date: "2024-01-12", description: "CREDIT - CONSULTING", amount: 8500, matched: false },
];

interface ReconciliationToolProps {
  organizationId: string;
  userId: string;
}

export default function ReconciliationTool({ organizationId, userId }: ReconciliationToolProps) {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [statementDate, setStatementDate] = useState("");
  const [statementBalance, setStatementBalance] = useState("");
  const [bookTransactions, setBookTransactions] = useState(mockUnreconciledTransactions);
  const [bankTransactions, setBankTransactions] = useState(mockBankStatementItems);
  const [selectedBookItems, setSelectedBookItems] = useState<string[]>([]);
  const [selectedBankItems, setSelectedBankItems] = useState<string[]>([]);

  const bookBalance = bookTransactions.reduce((sum, t) => 
    sum + (t.type === "credit" ? t.amount : -t.amount), 0
  );

  const difference = parseFloat(statementBalance || "0") - bookBalance;

  const handleMatch = () => {
    // Match selected items
    setBookTransactions(prev => 
      prev.map(t => selectedBookItems.includes(t.id) ? { ...t, matched: true } : t)
    );
    setBankTransactions(prev => 
      prev.map(t => selectedBankItems.includes(t.id) ? { ...t, matched: true } : t)
    );
    setSelectedBookItems([]);
    setSelectedBankItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Reconciliation Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Start Reconciliation</CardTitle>
          <CardDescription>Select account and enter statement details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="account">Bank Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gcb">GCB Bank - 1234567890</SelectItem>
                  <SelectItem value="ecobank">Ecobank - 0987654321</SelectItem>
                  <SelectItem value="stanbic">Stanbic - 5555666677</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statementDate">Statement Date</Label>
              <Input
                id="statementDate"
                type="date"
                value={statementDate}
                onChange={(e) => setStatementDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statementBalance">Statement Balance (GHS)</Label>
              <Input
                id="statementBalance"
                type="number"
                placeholder="0.00"
                value={statementBalance}
                onChange={(e) => setStatementBalance(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reconciliation Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Book Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {bookBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {bookTransactions.filter(t => !t.matched).length} unmatched items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statement Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {parseFloat(statementBalance || "0").toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {bankTransactions.filter(t => !t.matched).length} unmatched items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difference</CardTitle>
            {difference === 0 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${difference === 0 ? "text-emerald-600" : "text-orange-600"}`}>
              GHS {Math.abs(difference).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {difference === 0 ? "Balanced" : "Needs reconciliation"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Matching Interface */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Book Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Your Records</CardTitle>
            <CardDescription>Select transactions to match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookTransactions.filter(t => !t.matched).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    selectedBookItems.includes(transaction.id) ? "border-emerald-600 bg-emerald-50" : ""
                  }`}
                >
                  <Checkbox
                    checked={selectedBookItems.includes(transaction.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBookItems([...selectedBookItems, transaction.id]);
                      } else {
                        setSelectedBookItems(selectedBookItems.filter(id => id !== transaction.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.type === "credit" ? "text-emerald-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}GHS {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bank Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Statement</CardTitle>
            <CardDescription>Select matching items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bankTransactions.filter(t => !t.matched).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    selectedBankItems.includes(transaction.id) ? "border-emerald-600 bg-emerald-50" : ""
                  }`}
                >
                  <Checkbox
                    checked={selectedBankItems.includes(transaction.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBankItems([...selectedBankItems, transaction.id]);
                      } else {
                        setSelectedBankItems(selectedBankItems.filter(id => id !== transaction.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-sm font-semibold">
                    GHS {transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleMatch}
          disabled={selectedBookItems.length === 0 || selectedBankItems.length === 0}
        >
          Match Selected Items
        </Button>
      </div>
    </div>
  );
}
