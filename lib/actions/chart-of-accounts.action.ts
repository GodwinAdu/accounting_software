"use server"

import { connectToDB } from "../connection/mongoose"
import Account from "../models/account.model"
import { STANDARD_CHART_OF_ACCOUNTS } from "../constants/chart-of-accounts"
import { currentUser } from "../helpers/session"

export async function initializeChartOfAccounts(organizationId: string) {
  try {
    await connectToDB()
    const user = await currentUser()
    if (!user) return { error: "Unauthorized" }

    const accountMap = new Map()

    for (const template of STANDARD_CHART_OF_ACCOUNTS) {
      const parentId = template.parent ? accountMap.get(template.parent) : undefined

      const account = await Account.create({
        organizationId,
        accountCode: template.code,
        accountName: template.name,
        accountType: template.type,
        accountSubType: template.subType,
        parentAccountId: parentId,
        level: template.level,
        isParent: template.isParent || false,
        currency: "GHS",
        currentBalance: 0,
        debitBalance: 0,
        creditBalance: 0,
        isActive: true,
        isSystemAccount: true,
        allowManualJournal: true,
        reconciliationEnabled: false,
        del_flag: false,
        createdBy: user._id,
        mod_flag: 0,
      })

      accountMap.set(template.code, account._id)
    }

    return { success: true, message: "Chart of accounts initialized" }
  } catch (error: any) {
    return { error: error.message || "Failed to initialize chart of accounts" }
  }
}
