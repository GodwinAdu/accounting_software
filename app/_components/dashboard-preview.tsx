"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Receipt, FileText } from 'lucide-react'

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20 backdrop-blur-sm p-6 overflow-hidden">
        
        <div className="flex gap-2 mb-6">
          {['Dashboard', 'Reports', 'Invoices'].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === i 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-background/50 text-foreground/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foreground/60">Revenue</span>
                <TrendingUp className="text-emerald-600" size={16} />
              </div>
              <div className="text-2xl font-bold">$284,500</div>
              <div className="text-xs text-emerald-600">+12.5% from last month</div>
            </div>
            <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-foreground/60">Expenses</span>
                <TrendingDown className="text-red-500" size={16} />
              </div>
              <div className="text-2xl font-bold">$142,300</div>
              <div className="text-xs text-red-500">-8.2% from last month</div>
            </div>
          </div>

          <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Recent Transactions</span>
              <Receipt size={16} className="text-foreground/60" />
            </div>
            <div className="space-y-2">
              {[
                { name: 'Client Payment', amount: '+$12,500', type: 'income' },
                { name: 'Office Supplies', amount: '-$850', type: 'expense' },
                { name: 'Payroll Processing', amount: '-$45,200', type: 'expense' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-600' : 'bg-red-500'}`} />
                    <span className="text-xs">{tx.name}</span>
                  </div>
                  <span className={`text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-background/60 rounded-lg border border-emerald-500/20 text-center">
              <FileText size={16} className="mx-auto mb-1 text-foreground/60" />
              <div className="text-xs text-foreground/60">Invoices</div>
              <div className="font-bold text-sm">142</div>
            </div>
            <div className="p-3 bg-background/60 rounded-lg border border-emerald-500/20 text-center">
              <DollarSign size={16} className="mx-auto mb-1 text-foreground/60" />
              <div className="text-xs text-foreground/60">Paid</div>
              <div className="font-bold text-sm">$98K</div>
            </div>
            <div className="p-3 bg-background/60 rounded-lg border border-emerald-500/20 text-center">
              <Receipt size={16} className="mx-auto mb-1 text-foreground/60" />
              <div className="text-xs text-foreground/60">Pending</div>
              <div className="font-bold text-sm">$24K</div>
            </div>
          </div>

          <div className="h-24 bg-background/60 rounded-xl border border-emerald-500/20 p-3 relative overflow-hidden">
            <div className="text-xs text-foreground/60 mb-2">Cash Flow (6 months)</div>
            <div className="flex items-end justify-between h-12 gap-1">
              {[40, 65, 45, 80, 60, 90].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600 to-teal-600 rounded-t transition-all duration-500" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
