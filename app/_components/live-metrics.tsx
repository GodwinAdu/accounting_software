"use client"

import { useEffect, useState } from 'react'

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({
    transactions: 1247893,
    processing: 45230,
    saved: 12450000
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        transactions: prev.transactions + Math.floor(Math.random() * 5),
        processing: prev.processing + Math.floor(Math.random() * 100),
        saved: prev.saved + Math.floor(Math.random() * 1000)
      }))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-emerald-600/10 border-y border-emerald-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {metrics.transactions.toLocaleString()}
            </div>
            <div className="text-sm text-foreground/60 mt-2">Transactions Processed Today</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${(metrics.processing / 1000).toFixed(1)}K
            </div>
            <div className="text-sm text-foreground/60 mt-2">Currently Processing</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${(metrics.saved / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-foreground/60 mt-2">Saved in Accounting Fees</div>
          </div>
        </div>
      </div>
    </div>
  )
}
