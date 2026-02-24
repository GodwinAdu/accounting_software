"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Receipt, FileText, BarChart3, PieChart, Users } from 'lucide-react'

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const dashboardContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Revenue</span>
            <TrendingUp className="text-emerald-600" size={16} />
          </div>
          <div className="text-2xl font-bold">GHS 284,500</div>
          <div className="text-xs text-emerald-600">+12.5% from last month</div>
        </div>
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Expenses</span>
            <TrendingDown className="text-red-500" size={16} />
          </div>
          <div className="text-2xl font-bold">GHS 142,300</div>
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
            { name: 'Client Payment', amount: '+GHS 12,500', type: 'income' },
            { name: 'Office Supplies', amount: '-GHS 850', type: 'expense' },
            { name: 'Payroll Processing', amount: '-GHS 45,200', type: 'expense' },
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
          <div className="font-bold text-sm">GHS 98K</div>
        </div>
        <div className="p-3 bg-background/60 rounded-lg border border-emerald-500/20 text-center">
          <Receipt size={16} className="mx-auto mb-1 text-foreground/60" />
          <div className="text-xs text-foreground/60">Pending</div>
          <div className="font-bold text-sm">GHS 24K</div>
        </div>
      </div>
    </div>
  )

  const reportsContent = (
    <div className="space-y-4">
      <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Profit & Loss Statement</span>
          <BarChart3 size={16} className="text-foreground/60" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-foreground/60">Total Revenue</span>
            <span className="text-sm font-bold text-emerald-600">GHS 284,500</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-foreground/60">Total Expenses</span>
            <span className="text-sm font-bold text-red-500">GHS 142,300</span>
          </div>
          <div className="border-t border-border/20 pt-2 flex justify-between items-center">
            <span className="text-xs font-semibold">Net Profit</span>
            <span className="text-lg font-bold text-emerald-600">GHS 142,200</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Cash Flow</span>
            <TrendingUp className="text-emerald-600" size={16} />
          </div>
          <div className="text-xl font-bold">GHS 98,450</div>
          <div className="text-xs text-emerald-600">Positive trend</div>
        </div>
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Profit Margin</span>
            <PieChart className="text-blue-600" size={16} />
          </div>
          <div className="text-xl font-bold">49.9%</div>
          <div className="text-xs text-blue-600">Above target</div>
        </div>
      </div>

      <div className="h-32 bg-background/60 rounded-xl border border-emerald-500/20 p-3">
        <div className="text-xs text-foreground/60 mb-2">Revenue vs Expenses (6 months)</div>
        <div className="flex items-end justify-between h-20 gap-2">
          {[{r:60,e:30}, {r:70,e:35}, {r:55,e:40}, {r:85,e:45}, {r:75,e:38}, {r:95,e:42}].map((data, i) => (
            <div key={i} className="flex-1 flex gap-1">
              <div className="flex-1 bg-gradient-to-t from-emerald-600 to-teal-600 rounded-t" style={{ height: `${data.r}%` }} />
              <div className="flex-1 bg-gradient-to-t from-red-500 to-orange-500 rounded-t" style={{ height: `${data.e}%` }} />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
        <div className="text-xs text-foreground/60 mb-3">Top Expense Categories</div>
        <div className="space-y-2">
          {[
            { name: 'Payroll', amount: 'GHS 85,200', percent: 60 },
            { name: 'Rent & Utilities', amount: 'GHS 28,500', percent: 20 },
            { name: 'Marketing', amount: 'GHS 18,600', percent: 13 },
          ].map((cat, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span>{cat.name}</span>
                <span className="font-semibold">{cat.amount}</span>
              </div>
              <div className="h-1.5 bg-background/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full" style={{ width: `${cat.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const invoicesContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-background/60 rounded-xl border border-emerald-500/20 text-center">
          <FileText size={16} className="mx-auto mb-1 text-emerald-600" />
          <div className="text-xs text-foreground/60">Total</div>
          <div className="font-bold text-lg">142</div>
        </div>
        <div className="p-3 bg-background/60 rounded-xl border border-emerald-500/20 text-center">
          <DollarSign size={16} className="mx-auto mb-1 text-blue-600" />
          <div className="text-xs text-foreground/60">Paid</div>
          <div className="font-bold text-lg">98</div>
        </div>
        <div className="p-3 bg-background/60 rounded-xl border border-emerald-500/20 text-center">
          <Receipt size={16} className="mx-auto mb-1 text-orange-600" />
          <div className="text-xs text-foreground/60">Pending</div>
          <div className="font-bold text-lg">44</div>
        </div>
      </div>

      <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Recent Invoices</span>
          <FileText size={16} className="text-foreground/60" />
        </div>
        <div className="space-y-2">
          {[
            { id: 'INV-1024', client: 'Acme Corp', amount: 'GHS 12,500', status: 'paid' },
            { id: 'INV-1023', client: 'TechStart Inc', amount: 'GHS 8,750', status: 'pending' },
            { id: 'INV-1022', client: 'Global Solutions', amount: 'GHS 15,200', status: 'paid' },
            { id: 'INV-1021', client: 'Innovation Labs', amount: 'GHS 6,800', status: 'overdue' },
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
              <div>
                <div className="text-xs font-semibold">{inv.id}</div>
                <div className="text-xs text-foreground/60">{inv.client}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold">{inv.amount}</div>
                <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                  inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                  inv.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {inv.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Total Invoiced</span>
            <DollarSign className="text-emerald-600" size={16} />
          </div>
          <div className="text-xl font-bold">GHS 284,500</div>
          <div className="text-xs text-emerald-600">This month</div>
        </div>
        <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Outstanding</span>
            <Receipt className="text-orange-600" size={16} />
          </div>
          <div className="text-xl font-bold">GHS 42,800</div>
          <div className="text-xs text-orange-600">44 invoices</div>
        </div>
      </div>

      <div className="p-4 bg-background/60 rounded-xl border border-emerald-500/20">
        <div className="text-xs text-foreground/60 mb-3">Payment Status</div>
        <div className="flex gap-2 h-3 rounded-full overflow-hidden">
          <div className="bg-emerald-600" style={{ width: '69%' }} title="Paid: 69%" />
          <div className="bg-blue-500" style={{ width: '21%' }} title="Pending: 21%" />
          <div className="bg-red-500" style={{ width: '10%' }} title="Overdue: 10%" />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-emerald-600">69% Paid</span>
          <span className="text-blue-600">21% Pending</span>
          <span className="text-red-600">10% Overdue</span>
        </div>
      </div>
    </div>
  )

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

        <div className="transition-all duration-500">
          {activeTab === 0 && dashboardContent}
          {activeTab === 1 && reportsContent}
          {activeTab === 2 && invoicesContent}
        </div>
      </div>
    </div>
  )
}
