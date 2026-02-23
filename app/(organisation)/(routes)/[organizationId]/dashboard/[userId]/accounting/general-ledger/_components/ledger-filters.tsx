"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface LedgerFiltersProps {
  accounts: Array<{ _id: string; accountName: string; accountCode: string }>
}

export function LedgerFilters({ accounts }: LedgerFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [accountId, setAccountId] = useState(searchParams.get("accountId") || "")
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (accountId) params.set("accountId", accountId)
    if (startDate) params.set("startDate", startDate)
    if (endDate) params.set("endDate", endDate)
    
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setAccountId("")
    setStartDate("")
    setEndDate("")
    router.push(window.location.pathname)
  }

  const hasFilters = accountId || startDate || endDate

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-1.5 block">Account</label>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger>
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account._id} value={account._id}>
                {account.accountCode} - {account.accountName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-medium mb-1.5 block">Start Date</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="text-sm font-medium mb-1.5 block">End Date</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters}>Apply</Button>
        {hasFilters && (
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
