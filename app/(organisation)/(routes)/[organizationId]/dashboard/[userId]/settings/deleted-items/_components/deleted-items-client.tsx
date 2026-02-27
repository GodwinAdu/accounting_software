"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trash2, AlertTriangle, Search, Filter, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  getDeletedItemsSummary,
  getDeletedItemsByType,
  restoreDeletedItem,
} from "@/lib/actions/deleted-items.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type ModelType =
  | "bankAccounts"
  | "transactions"
  | "vendors"
  | "customers"
  | "invoices"
  | "products"
  | "chartOfAccounts"
  | "journalEntries";

const MODEL_LABELS: Record<ModelType, string> = {
  bankAccounts: "Bank Accounts",
  transactions: "Transactions",
  vendors: "Vendors",
  customers: "Customers",
  invoices: "Invoices",
  products: "Products",
  chartOfAccounts: "Chart of Accounts",
  journalEntries: "Journal Entries",
};

const MODEL_COLORS: Record<ModelType, string> = {
  bankAccounts: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  transactions: "bg-green-50 border-green-200 hover:bg-green-100",
  vendors: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  customers: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  invoices: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  products: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  chartOfAccounts: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  journalEntries: "bg-amber-50 border-amber-200 hover:bg-amber-100",
};

export default function DeletedItemsClient() {
  const [summary, setSummary] = useState<{ type: string; count: number }[]>([]);
  const [selectedType, setSelectedType] = useState<ModelType | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [restoreDialog, setRestoreDialog] = useState<{ open: boolean; item: any }>({
    open: false,
    item: null,
  });

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter((item) =>
        getItemName(item).toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const loadSummary = async () => {
    setLoading(true);
    const result = await getDeletedItemsSummary();
    if (result.summary) {
      setSummary(result.summary);
    } else if (result.error) {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const loadItems = async (type: ModelType) => {
    setSelectedType(type);
    setSearchQuery("");
    setLoading(true);
    const result = await getDeletedItemsByType(type);
    if (result.items) {
      setItems(result.items);
      setFilteredItems(result.items);
    } else if (result.error) {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleRestore = async () => {
    if (!restoreDialog.item || !selectedType) return;

    setRestoring(restoreDialog.item._id);
    const result = await restoreDeletedItem(selectedType, restoreDialog.item._id);

    if (result.success) {
      toast.success("Item restored successfully");
      loadItems(selectedType);
      loadSummary();
    } else {
      toast.error(result.error || "Failed to restore item");
    }

    setRestoring(null);
    setRestoreDialog({ open: false, item: null });
  };

  const getItemName = (item: any) => {
    if (!item) return "Unnamed Item";
    return (
      item.accountName ||
      item.name ||
      item.description ||
      item.invoiceNumber ||
      item.entryNumber ||
      "Unnamed Item"
    );
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalDeleted = summary.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Total Deleted</CardDescription>
            <CardTitle className="text-3xl font-bold">{totalDeleted}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Categories</CardDescription>
            <CardTitle className="text-3xl font-bold">{summary.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Selected</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {selectedType ? filteredItems.length : 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Status</CardDescription>
            <CardTitle className="text-lg font-semibold text-orange-600">
              {selectedType ? MODEL_LABELS[selectedType] : "Select Category"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Category Cards */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Select Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {summary.map(({ type, count }) => (
            <Card
              key={type}
              className={`cursor-pointer transition-all border-2 ${
                selectedType === type
                  ? "ring-2 ring-primary shadow-lg scale-105"
                  : MODEL_COLORS[type as ModelType]
              }`}
              onClick={() => loadItems(type as ModelType)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Trash2 className="h-5 w-5 text-muted-foreground" />
                  {count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {count}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">{MODEL_LABELS[type as ModelType]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {count} {count === 1 ? "item" : "items"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Items Table */}
      {selectedType && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Deleted {MODEL_LABELS[selectedType]}
                </CardTitle>
                <CardDescription className="mt-1">
                  {filteredItems.length} of {items.length} items shown
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Trash2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {searchQuery ? "No items match your search" : "No deleted items found"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "All items are active"}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Item Name</TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Deleted Date
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Deleted By</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item._id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{getItemName(item)}</p>
                            {item.deletionReason && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reason: {item.deletionReason}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div>
                            <p>{formatDate(item.deletedAt)}</p>
                            {item.deletionMetadata?.ipAddress && (
                              <p className="text-xs text-muted-foreground mt-1">
                                IP: {item.deletionMetadata.ipAddress}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.deletedBy || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRestoreDialog({ open: true, item })}
                            disabled={restoring === item._id}
                            className="hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {restoring === item._id ? "Restoring..." : "Restore"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog
        open={restoreDialog.open}
        onOpenChange={(open) => setRestoreDialog({ open, item: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-green-600" />
              Restore Item?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to restore{" "}
              <span className="font-semibold text-foreground">
                "{getItemName(restoreDialog.item)}"
              </span>
              ? This will make it visible and active again in the system.
              {restoreDialog.item?.deletionReason && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium text-foreground">Deletion Reason:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {restoreDialog.item.deletionReason}
                  </p>
                </div>
              )}
              {restoreDialog.item?.deletionMetadata?.ipAddress && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Deleted from IP: {restoreDialog.item.deletionMetadata.ipAddress}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              className="bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
