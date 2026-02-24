"use client"

import { Shield, Lock, Award, CheckCircle2 } from 'lucide-react'

export default function TrustBadges() {
  const badges = [
    { icon: Shield, text: 'SOC 2 Certified', color: 'from-blue-600 to-cyan-600' },
    { icon: Lock, text: 'Bank-Level Security', color: 'from-emerald-600 to-teal-600' },
    { icon: Award, text: 'GAAP Compliant', color: 'from-purple-600 to-pink-600' },
    { icon: CheckCircle2, text: 'IRS Approved', color: 'from-orange-600 to-red-600' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-12">
      {badges.map((badge, i) => {
        const Icon = badge.icon
        return (
          <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/30 border border-border/40 hover:border-emerald-500/40 transition-all duration-300">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
              <Icon className="text-white" size={24} />
            </div>
            <span className="text-sm font-medium text-center">{badge.text}</span>
          </div>
        )
      })}
    </div>
  )
}
