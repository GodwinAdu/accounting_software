

import { connectToDB } from "@/lib/connection/mongoose";
import Loan from "@/lib/models/loan.model";
import JournalEntry from "@/lib/models/journal-entry.model";

export function calculateLoanPayment(principal: number, annualRate: number, termMonths: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment * 100) / 100;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  startDate: Date
) {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateLoanPayment(principal, annualRate, termMonths);
  
  const schedule = [];
  let balance = principal;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);
    
    schedule.push({
      month,
      paymentDate,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
    });
  }
  
  return schedule;
}

