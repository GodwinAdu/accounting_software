"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { createColumns, Transaction } from "./columns";
import TransactionDetailModal from "./transaction-detail-modal";

interface GeneralLedgerTableProps {
  transactions: Transaction[];
}

export default function GeneralLedgerTable({ transactions }: GeneralLedgerTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const columns = createColumns(handleViewDetails);

  console.log('GeneralLedgerTable received transactions:', transactions.length);

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">No transactions found. Create journal entries to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <DataTable columns={columns} data={transactions} searchKey="description" />
      <TransactionDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
