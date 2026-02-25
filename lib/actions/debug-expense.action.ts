"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Expense from "@/lib/models/expense.model";
import { withAuth } from "@/lib/helpers/auth";

async function _debugExpense(user: any, expenseId: string) {
  try {
    await connectToDB();
    
    const expense = await Expense.findById(expenseId).lean();
    
    console.log("=== EXPENSE DEBUG ===");
    console.log("Expense ID:", expenseId);
    console.log("Project ID:", expense?.projectId);
    console.log("Full expense:", JSON.stringify(expense, null, 2));
    
    return {
      success: true,
      data: {
        hasProjectId: !!expense?.projectId,
        projectId: expense?.projectId,
        expenseNumber: expense?.expenseNumber,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const debugExpense = await withAuth(_debugExpense);
