"use server";

import { openai, AI_CONFIG } from "../ai/config";
import { withAuth } from "../helpers/auth";
import { connectToDB } from "../connection/mongoose";
import { revalidatePath } from "next/cache";
import { checkModuleAccess } from "../helpers/module-access";
import AIConversation from "../models/ai-conversation.model";

async function _chatWithAI(user: any, message: string, conversationHistory: any[] = [], conversationId?: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();

    const Account = (await import("../models/account.model")).default;
    const Invoice = (await import("../models/invoice.model")).default;
    const Expense = (await import("../models/expense.model")).default;

    const [accounts, recentInvoices, recentExpenses] = await Promise.all([
      Account.find({ organizationId: user.organizationId, del_flag: false }).limit(20),
      Invoice.find({ organizationId: user.organizationId, del_flag: false }).sort({ createdAt: -1 }).limit(10),
      Expense.find({ organizationId: user.organizationId, del_flag: false }).sort({ date: -1 }).limit(10),
    ]);

    const totalRevenue = recentInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalExpenses = recentExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const systemPrompt = `You are PayFlow AI, an expert financial assistant for accounting and payroll management.

CONTEXT:
- Organization: ${user.organizationName || "User's Business"}
- Total Accounts: ${accounts.length}
- Recent Revenue: GHS ${totalRevenue.toLocaleString()}
- Recent Expenses: GHS ${totalExpenses.toLocaleString()}
- Net: GHS ${(totalRevenue - totalExpenses).toLocaleString()}

CAPABILITIES:
1. ACCOUNTING GUIDANCE
   - Explain debits, credits, double-entry bookkeeping
   - Guide through journal entries and reconciliation
   - Help with chart of accounts setup
   - Explain financial statements (P&L, Balance Sheet, Cash Flow)

2. PAYFLOW FEATURES
   - Navigate invoicing, expenses, payroll modules
   - Explain report generation and customization
   - Guide through bank reconciliation process
   - Help with tax settings and compliance

3. FINANCIAL ANALYSIS
   - Analyze cash flow patterns and trends
   - Identify cost-saving opportunities
   - Suggest revenue optimization strategies
   - Highlight financial risks and red flags

4. TAX & COMPLIANCE
   - Explain tax obligations and deadlines
   - Guide through VAT/GST calculations
   - Help with payroll tax compliance
   - Suggest tax-saving strategies

5. BUSINESS INSIGHTS
   - Provide KPI recommendations
   - Suggest financial best practices
   - Help with budgeting and forecasting
   - Offer industry-specific advice

GUIDELINES:
- Be concise, professional, and actionable
- Use simple language for complex concepts
- Provide step-by-step instructions when needed
- Reference specific PayFlow features
- Always prioritize accuracy
- Recommend professional accountant for complex matters
- Use GHS currency for all amounts

Respond with helpful, accurate financial guidance.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory,
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: messages as any,
      temperature: AI_CONFIG.temperature,
      max_tokens: 1500,
    });

    const followUpPrompt = `Based on this conversation, suggest 3 relevant follow-up questions the user might ask. Return only a JSON array of strings: ["question1", "question2", "question3"]`;
    
    const followUpResponse = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [
        ...messages.slice(0, -1) as any,
        { role: "assistant", content: response.choices[0].message.content },
        { role: "user", content: followUpPrompt },
      ],
      temperature: 0.7,
      max_tokens: 150,
      response_format: { type: "json_object" },
    });

    let followUpQuestions: string[] = [];
    try {
      const parsed = JSON.parse(followUpResponse.choices[0].message.content || "{}");
      followUpQuestions = parsed.questions || [];
    } catch {}

    
    if (conversationId) {
      await AIConversation.findByIdAndUpdate(conversationId, {
        $push: {
          messages: [
            { role: "user", content: message, timestamp: new Date() },
            { role: "assistant", content: response.choices[0].message.content, timestamp: new Date(), followUpQuestions },
          ],
        },
        lastMessageAt: new Date(),
      });
    } else {
      const firstUserMessage = message.slice(0, 50);
      await AIConversation.create({
        userId: user._id,
        organizationId: user.organizationId,
        title: firstUserMessage,
        messages: [
          { role: "user", content: message, timestamp: new Date() },
          { role: "assistant", content: response.choices[0].message.content, timestamp: new Date(), followUpQuestions },
        ],
        lastMessageAt: new Date(),
      });
    }

    return {
      success: true,
      message: response.choices[0].message.content,
      followUpQuestions,
      usage: response.usage,
    };
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return { success: false, error: error.message };
  }
}

async function _getFinancialInsights(user: any) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();

    const Invoice = (await import("../models/invoice.model")).default;
    const Expense = (await import("../models/expense.model")).default;
    const Account = (await import("../models/account.model")).default;

    const [invoices, expenses, accounts] = await Promise.all([
      Invoice.find({ organizationId: user.organizationId, del_flag: false }),
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name"),
      Account.find({ organizationId: user.organizationId, del_flag: false, accountType: { $in: ["revenue", "expense"] } }),
    ]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const netIncome = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(2) : 0;

    const overdueInvoices = invoices.filter(inv => 
      inv.status === "overdue" || (inv.status === "sent" && new Date(inv.dueDate) < new Date())
    );
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + ((inv.totalAmount || 0) - (inv.paidAmount || 0)), 0);

    const expensesByCategory = expenses.reduce((acc: any, exp) => {
      const categoryName = (exp.categoryId as any)?.name || "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + (exp.amount || 0);
      return acc;
    }, {});

    const topExpenseCategory = Object.entries(expensesByCategory).sort((a: [string, any], b: [string, any]) => (b[1] as number) - (a[1] as number))[0];

    const prompt = `Analyze this financial data and provide 3-5 actionable insights:

FINANCIAL SUMMARY:
- Total Revenue: GHS ${totalRevenue.toLocaleString()}
- Total Expenses: GHS ${totalExpenses.toLocaleString()}
- Net Income: GHS ${netIncome.toLocaleString()}
- Profit Margin: ${profitMargin}%
- Overdue Invoices: ${overdueInvoices.length} (GHS ${totalOverdue.toLocaleString()})
- Top Expense Category: ${topExpenseCategory?.[0]} (GHS ${topExpenseCategory?.[1]?.toLocaleString()})

Provide insights on:
1. Financial health assessment
2. Cash flow concerns
3. Cost optimization opportunities
4. Revenue growth suggestions
5. Risk areas to address

Format as bullet points, be specific and actionable.`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    return {
      success: true,
      insights: response.choices[0].message.content,
      metrics: {
        totalRevenue,
        totalExpenses,
        netIncome,
        profitMargin,
        overdueInvoices: overdueInvoices.length,
        totalOverdue,
      },
    };
  } catch (error: any) {
    console.error("Financial Insights Error:", error);
    return { success: false, error: error.message };
  }
}

async function _categorizeExpense(user: any, description: string, amount: number, vendor?: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();

    const Expense = (await import("../models/expense.model")).default;
    const Account = (await import("../models/account.model")).default;

    const ExpenseCategory = (await import("../models/expense-category.model")).default;

    const [recentExpenses, expenseAccounts, expenseCategories] = await Promise.all([
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .limit(50),
      Account.find({ organizationId: user.organizationId, del_flag: false, accountType: "expense" }),
      ExpenseCategory.find({ organizationId: user.organizationId, del_flag: false }),
    ]);

    const categoryExamples = recentExpenses
      .filter(exp => exp.categoryId && exp.description)
      .slice(0, 20)
      .map(exp => `${exp.description} -> ${(exp.categoryId as any)?.name}`)
      .join("\n");

    const availableCategories = expenseCategories.map(cat => (cat as any).name);
    const availableAccounts = expenseAccounts.map(acc => `${acc.accountName} (${acc.accountCode})`);

    const prompt = `You are an AI expense categorization assistant. Analyze the expense and suggest the best category and account.

EXPENSE DETAILS:
- Description: ${description}
- Amount: GHS ${amount.toLocaleString()}
${vendor ? `- Vendor: ${vendor}` : ""}

AVAILABLE CATEGORIES:
${availableCategories.length > 0 ? availableCategories.join(", ") : "Office Supplies, Travel, Utilities, Rent, Salaries, Marketing, Insurance, Professional Fees, Maintenance, Miscellaneous"}

AVAILABLE EXPENSE ACCOUNTS:
${availableAccounts.join("\n")}

RECENT CATEGORIZATION EXAMPLES:
${categoryExamples || "No recent examples"}

Provide a JSON response with:
{
  "category": "suggested category",
  "account": "suggested account name",
  "confidence": "high/medium/low",
  "reasoning": "brief explanation",
  "tags": ["tag1", "tag2"]
}

Be consistent with existing patterns. Only suggest categories and accounts from the available lists.`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const suggestion = JSON.parse(response.choices[0].message.content || "{}");

    return {
      success: true,
      suggestion,
    };
  } catch (error: any) {
    console.error("Expense Categorization Error:", error);
    return { success: false, error: error.message };
  }
}

async function _extractInvoiceData(user: any, imageBase64: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const prompt = `Extract invoice/receipt data from this image. Return JSON with:
{
  "vendor": "vendor name",
  "amount": number,
  "date": "YYYY-MM-DD",
  "invoiceNumber": "invoice number",
  "items": [{"description": "item", "quantity": 1, "price": 0}],
  "tax": number,
  "confidence": "high/medium/low"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "high"
              } 
            },
          ],
        },
      ],
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _detectAnomalies(user: any) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Expense = (await import("../models/expense.model")).default;
    const Invoice = (await import("../models/invoice.model")).default;

    const [expenses, invoices] = await Promise.all([
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .limit(100),
      Invoice.find({ organizationId: user.organizationId, del_flag: false }).sort({ createdAt: -1 }).limit(100),
    ]);

    const expenseStats = expenses.reduce((acc, exp) => {
      const categoryName = (exp.categoryId as any)?.name || "Uncategorized";
      const key = `${exp.vendorId}-${categoryName}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(exp.amount);
      return acc;
    }, {} as any);

    const anomalies = [];

    for (const exp of expenses.slice(0, 20)) {
      const categoryName = (exp.categoryId as any)?.name || "Uncategorized";
      const key = `${exp.vendorId}-${categoryName}`;
      const amounts = expenseStats[key] || [];
      if (amounts.length > 3) {
        const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length);
        if (exp.amount > avg + 2 * stdDev) {
          anomalies.push({
            type: "unusual_amount",
            severity: "medium",
            description: `Expense of GHS ${exp.amount.toLocaleString()} is ${((exp.amount / avg - 1) * 100).toFixed(0)}% higher than average`,
            reference: String(exp._id),
            date: exp.date,
          });
        }
      }
    }

    const duplicates = expenses.filter((exp, i, arr) => 
      arr.findIndex(e => e.amount === exp.amount && e.vendorId === exp.vendorId && 
        Math.abs(new Date(e.date).getTime() - new Date(exp.date).getTime()) < 86400000) !== i
    );

    duplicates.forEach(dup => {
      anomalies.push({
        type: "duplicate",
        severity: "high",
        description: `Potential duplicate expense: GHS ${dup.amount.toLocaleString()}`,
        reference: String(dup._id),
        date: dup.date,
      });
    });

    return { success: true, anomalies: anomalies.slice(0, 10) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _forecastFinancials(user: any, months: number = 3) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Invoice = (await import("../models/invoice.model")).default;
    const Expense = (await import("../models/expense.model")).default;

    const [expenses, invoices] = await Promise.all([
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name"),
      Invoice.find({ organizationId: user.organizationId, del_flag: false }),
    ]);

    const monthlyData: any = {};
    invoices.forEach(inv => {
      const month = new Date(inv.createdAt).toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 };
      monthlyData[month].revenue += inv.totalAmount || 0;
    });

    expenses.forEach(exp => {
      const month = new Date(exp.date).toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 };
      monthlyData[month].expenses += exp.amount || 0;
    });

    const historicalMonths = Object.entries(monthlyData)
      .sort()
      .slice(-6)
      .map(([month, data]: any) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
        netIncome: data.revenue - data.expenses
      }));

    const dataStr = Object.entries(monthlyData)
      .sort()
      .map(([month, data]: any) => `${month}: Revenue GHS ${data.revenue.toLocaleString()}, Expenses GHS ${data.expenses.toLocaleString()}`)
      .join("\n");

    const prompt = `Based on this historical data, forecast the next ${months} months. Provide JSON:
{
  "forecast": [{"month": "YYYY-MM", "revenue": 0, "expenses": 0, "confidence": "high/medium/low"}],
  "insights": "key trends and recommendations",
  "trend": "growing/stable/declining"
}

DATA:
${dataStr}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return { success: true, ...result, historical: historicalMonths };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _smartReconcile(user: any, bankTransactions: any[]) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Expense = (await import("../models/expense.model")).default;
    const Invoice = (await import("../models/invoice.model")).default;

    const [expenses, invoices] = await Promise.all([
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name"),
      Invoice.find({ organizationId: user.organizationId, del_flag: false }),
    ]);

    const matches = [];
    for (const txn of bankTransactions) {
      const expenseMatch = expenses.find(exp => 
        Math.abs(exp.amount - Math.abs(txn.amount)) < 0.01 &&
        Math.abs(new Date(exp.date).getTime() - new Date(txn.date).getTime()) < 604800000
      );

      const invoiceMatch = invoices.find(inv => 
        Math.abs((inv.totalAmount || 0) - Math.abs(txn.amount)) < 0.01 &&
        Math.abs(new Date(inv.createdAt).getTime() - new Date(txn.date).getTime()) < 604800000
      );

      if (expenseMatch || invoiceMatch) {
        matches.push({
          transaction: txn,
          match: expenseMatch ? { type: "expense", id: String(expenseMatch._id) } : { type: "invoice", id: String(invoiceMatch._id) },
          confidence: "high",
        });
      }
    }

    return { success: true, matches };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _getConversationHistory(user: any, limit: number = 10) {
  try {
    await connectToDB();

    const conversations = await AIConversation.find({
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .sort({ lastMessageAt: -1 })
      .limit(limit)
      .select("title messages lastMessageAt createdAt tags");

    return {
      success: true,
      conversations: conversations.map(conv => ({
        id: String(conv._id),
        title: conv.title,
        messageCount: conv.messages.length,
        lastMessageAt: conv.lastMessageAt.toISOString(),
        createdAt: conv.createdAt.toISOString(),
        tags: conv.tags || [],
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _getConversation(user: any, conversationId: string) {
  try {
    await connectToDB();

    const conversation = await AIConversation.findOne({
      _id: conversationId,
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    return {
      success: true,
      conversation: {
        id: String(conversation._id),
        title: conversation.title,
        tags: conversation.tags || [],
        messages: conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
          followUpQuestions: msg.followUpQuestions || [],
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _deleteConversation(user: any, conversationId: string, pathname: string) {
  try {
    await connectToDB();

    await AIConversation.findOneAndUpdate(
      { _id: conversationId, userId: user._id, organizationId: user.organizationId },
      { del_flag: true }
    );

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _smartSearch(user: any, query: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Invoice = (await import("../models/invoice.model")).default;
    const Expense = (await import("../models/expense.model")).default;
    const Customer = (await import("../models/customer.model")).default;
    const Vendor = (await import("../models/vendor.model")).default;

    const [invoices, expenses, customers, vendors] = await Promise.all([
      Invoice.find({ organizationId: user.organizationId, del_flag: false }).limit(100),
      Expense.find({ organizationId: user.organizationId, del_flag: false })
        .populate("categoryId", "name")
        .limit(100),
      Customer.find({ organizationId: user.organizationId, del_flag: false }).limit(50),
      Vendor.find({ organizationId: user.organizationId, del_flag: false }).limit(50),
    ]);

    const prompt = `You are a smart search assistant for accounting software. Parse this natural language query and return relevant results.

QUERY: "${query}"

AVAILABLE DATA:
- ${invoices.length} invoices
- ${expenses.length} expenses
- ${customers.length} customers
- ${vendors.length} vendors

Analyze the query and return JSON:
{
  "intent": "search_invoices|search_expenses|search_customers|search_vendors|generate_report|answer_question",
  "filters": {
    "status": "paid|unpaid|overdue|draft",
    "dateRange": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
    "amountRange": {"min": 0, "max": 0},
    "customer": "customer name",
    "vendor": "vendor name"
  },
  "response": "natural language response to user"
}

Examples:
- "unpaid invoices" -> search invoices with status=unpaid
- "expenses over 1000 last month" -> search expenses with amount>1000 in date range
- "total revenue this year" -> generate report with sum of invoices`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    let results: any[] = [];

    if (parsed.intent === "search_invoices") {
      results = invoices.filter(inv => {
        if (parsed.filters?.status && inv.status !== parsed.filters.status) return false;
        if (parsed.filters?.amountRange?.min && inv.totalAmount < parsed.filters.amountRange.min) return false;
        if (parsed.filters?.amountRange?.max && inv.totalAmount > parsed.filters.amountRange.max) return false;
        return true;
      }).slice(0, 20).map(inv => ({
        type: "invoice",
        id: String(inv._id),
        number: inv.invoiceNumber,
        customer: inv.customerId,
        amount: inv.totalAmount,
        status: inv.status,
        date: inv.createdAt,
      }));
    } else if (parsed.intent === "search_expenses") {
      results = expenses.filter(exp => {
        if (parsed.filters?.amountRange?.min && exp.amount < parsed.filters.amountRange.min) return false;
        if (parsed.filters?.amountRange?.max && exp.amount > parsed.filters.amountRange.max) return false;
        return true;
      }).slice(0, 20).map(exp => ({
        type: "expense",
        id: String(exp._id),
        description: exp.description,
        amount: exp.amount,
        category: (exp.categoryId as any)?.name,
        date: exp.date,
      }));
    }

    return { success: true, intent: parsed.intent, results, response: parsed.response };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _generateEmail(user: any, type: string, recipientName: string, amount?: number, invoiceNumber?: string, dueDate?: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    
    const Organization = (await import("../models/organization.model")).default;
    const organization = await Organization.findById(user.organizationId);
    
    const senderName = user.fullName || "[Your Name]";
    const senderEmail = user.email || "[Your Email]";
    const companyName = organization?.name || "[Your Company]";
    const companyPhone = organization?.emailSettings?.fromEmail || organization?.email || "[Company Email]";
    const companyContact = organization?.phone || "[Company Phone]";
    
    const prompts = {
      payment_reminder: `Write a professional payment reminder email for ${recipientName}. Invoice ${invoiceNumber} for GHS ${amount?.toLocaleString()} was due on ${dueDate}. Be polite but firm. Sign off with:\n\nBest regards,\n${senderName}\n${companyName}\n${companyPhone}\n${companyContact}`,
      thank_you: `Write a thank you email to ${recipientName} for their payment of GHS ${amount?.toLocaleString()} for invoice ${invoiceNumber}. Sign off with:\n\nBest regards,\n${senderName}\n${companyName}\n${companyPhone}\n${companyContact}`,
      overdue_notice: `Write a professional overdue payment notice to ${recipientName}. Invoice ${invoiceNumber} for GHS ${amount?.toLocaleString()} is now ${Math.floor((Date.now() - new Date(dueDate!).getTime()) / 86400000)} days overdue. Be firm but professional. Sign off with:\n\nBest regards,\n${senderName}\n${companyName}\n${companyPhone}\n${companyContact}`,
      welcome: `Write a welcome email to new customer ${recipientName} thanking them for choosing our services. Sign off with:\n\nBest regards,\n${senderName}\n${companyName}\n${companyPhone}\n${companyContact}`,
    };

    const prompt = prompts[type as keyof typeof prompts] || prompts.payment_reminder;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    return { success: true, email: response.choices[0].message.content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _sendEmail(user: any, recipientEmail: string, subject: string, body: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    
    const Organization = (await import("../models/organization.model")).default;
    const organization = await Organization.findById(user.organizationId);
    
    const emailSettings = organization?.emailSettings;
    
    if (!emailSettings?.smtpHost || !emailSettings?.smtpUsername || !emailSettings?.smtpPassword) {
      return { success: false, error: "Email settings not configured. Please configure SMTP settings in organization settings." };
    }

    const nodemailer = await import("nodemailer");
    
    const transporter = nodemailer.default.createTransport({
      host: emailSettings.smtpHost,
      port: emailSettings.smtpPort || 587,
      secure: emailSettings.smtpPort === 465,
      auth: {
        user: emailSettings.smtpUsername,
        pass: emailSettings.smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"${emailSettings.fromName || organization?.name}" <${emailSettings.fromEmail || emailSettings.smtpUsername}>`,
      to: recipientEmail,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _searchConversations(user: any, query: string) {
  try {
    await connectToDB();

    const conversations = await AIConversation.find({
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { "messages.content": { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .sort({ lastMessageAt: -1 })
      .limit(20)
      .select("title messages lastMessageAt tags");

    return {
      success: true,
      results: conversations.map(conv => {
        const matchingMessages = conv.messages.filter((msg: any) => 
          msg.content.toLowerCase().includes(query.toLowerCase())
        );
        return {
          id: String(conv._id),
          title: conv.title,
          tags: conv.tags || [],
          messageCount: conv.messages.length,
          matchCount: matchingMessages.length,
          lastMessageAt: conv.lastMessageAt.toISOString(),
          preview: matchingMessages[0]?.content.slice(0, 100) || conv.messages[0]?.content.slice(0, 100),
        };
      }),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _shareConversation(user: any, conversationId: string) {
  try {
    await connectToDB();
   
    const crypto = await import("crypto");

    const shareToken = crypto.randomBytes(16).toString("hex");

    await AIConversation.findOneAndUpdate(
      { _id: conversationId, userId: user._id, organizationId: user.organizationId },
      { isShared: true, shareToken }
    );

    return { success: true, shareToken };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _getSharedConversation(shareToken: string) {
  try {
    await connectToDB();

    const conversation = await AIConversation.findOne({
      shareToken,
      isShared: true,
      del_flag: false,
    });

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    return {
      success: true,
      conversation: {
        title: conversation.title,
        tags: conversation.tags || [],
        messages: conversation.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _updateConversationTags(user: any, conversationId: string, tags: string[]) {
  try {
    await connectToDB();

    await AIConversation.findOneAndUpdate(
      { _id: conversationId, userId: user._id, organizationId: user.organizationId },
      { tags }
    );

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _regenerateResponse(user: any, conversationId: string, messageIndex: number) {
  try {
    await connectToDB();

    const conversation = await AIConversation.findOne({
      _id: conversationId,
      userId: user._id,
      organizationId: user.organizationId,
    });

    if (!conversation || messageIndex >= conversation.messages.length) {
      return { success: false, error: "Invalid message" };
    }

    const conversationHistory = conversation.messages.slice(0, messageIndex).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const userMessage = conversation.messages[messageIndex].content;

    const result = await _chatWithAI(user, userMessage, conversationHistory, conversationId);

    if (result.success) {
      conversation.messages.splice(messageIndex + 1);
      await conversation.save();
    }

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _editMessage(user: any, conversationId: string, messageIndex: number, newContent: string) {
  try {
    await connectToDB();

    const conversation = await AIConversation.findOne({
      _id: conversationId,
      userId: user._id,
      organizationId: user.organizationId,
    });

    if (!conversation || messageIndex >= conversation.messages.length) {
      return { success: false, error: "Invalid message" };
    }

    conversation.messages[messageIndex].content = newContent;
    conversation.messages.splice(messageIndex + 1);
    await conversation.save();

    const conversationHistory = conversation.messages.slice(0, messageIndex + 1).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const result = await _chatWithAI(user, newContent, conversationHistory, conversationId);

    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// PAYROLL AI FEATURES
async function _suggestSalary(user: any, role: string, experience: number, industry?: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    const prompt = `Suggest a competitive salary range in Ghana for:
Role: ${role}
Experience: ${experience} years
Industry: ${industry || "General"}

Return JSON: {"min": 0, "max": 0, "average": 0, "currency": "GHS", "reasoning": "explanation"}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    return { success: true, suggestion: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _analyzePayroll(user: any) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const PayrollRun = (await import("../models/payroll-run.model")).default;

    const payrolls = await PayrollRun.find({ organizationId: user.organizationId, del_flag: false })
      .sort({ payPeriodEnd: -1 })
      .limit(12);

    const totalPayroll = payrolls.reduce((sum, p) => sum + (p.totalNetPay || 0), 0);
    const avgPayroll = totalPayroll / (payrolls.length || 1);

    const anomalies = payrolls.filter(p => Math.abs((p.totalNetPay || 0) - avgPayroll) > avgPayroll * 0.3);

    const prompt = `Analyze payroll data:
Total: GHS ${totalPayroll.toLocaleString()}
Average: GHS ${avgPayroll.toLocaleString()}
Anomalies: ${anomalies.length}

Provide 3-5 insights on cost optimization, compliance, and trends.`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    return { success: true, insights: response.choices[0].message.content, anomalies: anomalies.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ACCOUNTING AI FEATURES
async function _suggestJournalEntry(user: any, description: string, amount: number) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Account = (await import("../models/account.model")).default;
    const accounts = await Account.find({ organizationId: user.organizationId, del_flag: false });

    const accountList = accounts.map(a => `${a.accountName} (${a.accountCode}) - ${a.accountType}`).join("\n");

    const prompt = `Suggest journal entry for:
Description: ${description}
Amount: GHS ${amount.toLocaleString()}

Available accounts:
${accountList}

Return JSON: {"debit": {"account": "name", "amount": 0}, "credit": {"account": "name", "amount": 0}, "reasoning": "explanation"}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    return { success: true, suggestion: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// TAX AI FEATURES
async function _suggestTaxDeductions(user: any) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Expense = (await import("../models/expense.model")).default;
    const expenses = await Expense.find({ organizationId: user.organizationId, del_flag: false })
      .populate("categoryId", "name")
      .limit(100);

    const categories = expenses.reduce((acc: any, exp) => {
      const cat = (exp.categoryId as any)?.name || "Other";
      acc[cat] = (acc[cat] || 0) + exp.amount;
      return acc;
    }, {});

    const prompt = `Analyze expenses for tax deductions in Ghana:
${Object.entries(categories).map(([k, v]) => `${k}: GHS ${(v as number).toLocaleString()}`).join("\n")}

Suggest tax-deductible items and estimated savings.`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    return { success: true, suggestions: response.choices[0].message.content };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// PRODUCTS/INVENTORY AI FEATURES
async function _forecastDemand(user: any, productId: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Invoice = (await import("../models/invoice.model")).default;
    const invoices = await Invoice.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      "items.productId": productId 
    });

    const monthlySales: any = {};
    invoices.forEach(inv => {
      const month = new Date(inv.createdAt).toISOString().slice(0, 7);
      const qty = inv.items.find((i: any) => String(i.productId) === productId)?.quantity || 0;
      monthlySales[month] = (monthlySales[month] || 0) + qty;
    });

    const prompt = `Forecast demand for next 3 months based on:
${Object.entries(monthlySales).map(([m, q]) => `${m}: ${q} units`).join("\n")}

Return JSON: {"forecast": [{"month": "YYYY-MM", "quantity": 0}], "reorderPoint": 0, "confidence": "high/medium/low"}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    return { success: true, forecast: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _optimizePrice(user: any, productId: string, currentPrice: number) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Invoice = (await import("../models/invoice.model")).default;
    const invoices = await Invoice.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      "items.productId": productId 
    }).limit(50);

    const sales = invoices.map(inv => {
      const item = inv.items.find((i: any) => String(i.productId) === productId);
      return { price: item?.unitPrice || 0, quantity: item?.quantity || 0 };
    });

    const prompt = `Optimize price for product:
Current: GHS ${currentPrice}
Sales history: ${sales.length} transactions
Avg quantity: ${sales.reduce((s, i) => s + i.quantity, 0) / sales.length}

Return JSON: {"suggestedPrice": 0, "expectedRevenue": 0, "reasoning": "explanation"}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 250,
      response_format: { type: "json_object" },
    });

    return { success: true, optimization: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// CRM AI FEATURES
async function _segmentCustomers(user: any) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Customer = (await import("../models/customer.model")).default;
    const Invoice = (await import("../models/invoice.model")).default;

    const customers = await Customer.find({ organizationId: user.organizationId, del_flag: false });
    const invoices = await Invoice.find({ organizationId: user.organizationId, del_flag: false });

    const customerData = customers.map(c => {
      const custInvoices = invoices.filter(inv => String(inv.customerId) === String(c._id));
      const total = custInvoices.reduce((s, i) => s + (i.totalAmount || 0), 0);
      return { name: c.name, total, count: custInvoices.length };
    });

    const prompt = `Segment ${customers.length} customers into groups (High-value, Regular, At-risk, New):
Top customers: ${customerData.slice(0, 10).map(c => `${c.name}: GHS ${c.total.toLocaleString()}`).join(", ")}

Return JSON: {"segments": [{"name": "segment", "count": 0, "characteristics": "description"}]}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    return { success: true, segments: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _scoreLeads(user: any, leadData: any[]) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    const prompt = `Score these leads (0-100):
${leadData.map(l => `${l.name}: ${l.company || "N/A"}, ${l.email || "N/A"}`).join("\n")}

Return JSON: {"scores": [{"name": "name", "score": 0, "priority": "high/medium/low", "reasoning": "why"}]}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    return { success: true, scores: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// PROJECTS AI FEATURES
async function _forecastProjectBudget(user: any, projectName: string, estimatedHours: number, resources: number) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    const prompt = `Forecast budget for project:
Name: ${projectName}
Estimated hours: ${estimatedHours}
Resources: ${resources}

Return JSON: {"estimatedCost": 0, "contingency": 0, "timeline": "duration", "risks": ["risk1"]}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    return { success: true, forecast: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// BUDGETING AI FEATURES
async function _suggestBudget(user: any, category: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    await connectToDB();
    const Expense = (await import("../models/expense.model")).default;
    const expenses = await Expense.find({ 
      organizationId: user.organizationId, 
      del_flag: false 
    }).populate("categoryId", "name").limit(100);

    const categoryExpenses = expenses.filter(e => (e.categoryId as any)?.name === category);
    const total = categoryExpenses.reduce((s, e) => s + e.amount, 0);
    const avg = total / (categoryExpenses.length || 1);

    const prompt = `Suggest monthly budget for ${category}:
Historical avg: GHS ${avg.toLocaleString()}
Total expenses: ${categoryExpenses.length}

Return JSON: {"suggested": 0, "min": 0, "max": 0, "reasoning": "explanation"}`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    return { success: true, budget: JSON.parse(response.choices[0].message.content || "{}") };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _analyzeVariance(user: any, budgeted: number, actual: number, category: string) {
  try {
    if (!await checkModuleAccess(user.organizationId, "ai")) {
      return { success: false, error: "AI module is not enabled for your organization" };
    }

    const variance = actual - budgeted;
    const percentVariance = ((variance / budgeted) * 100).toFixed(1);

    const prompt = `Analyze budget variance:
Category: ${category}
Budgeted: GHS ${budgeted.toLocaleString()}
Actual: GHS ${actual.toLocaleString()}
Variance: ${percentVariance}%

Provide analysis and recommendations.`;

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 300,
    });

    return { success: true, analysis: response.choices[0].message.content, variance: parseFloat(percentVariance) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const chatWithAI = await withAuth(_chatWithAI);
export const getFinancialInsights = await withAuth(_getFinancialInsights);
export const categorizeExpense = await withAuth(_categorizeExpense);
export const getConversationHistory = await withAuth(_getConversationHistory);
export const getConversation = await withAuth(_getConversation);
export const deleteConversation = await withAuth(_deleteConversation);
export const extractInvoiceData = await withAuth(_extractInvoiceData);
export const detectAnomalies = await withAuth(_detectAnomalies);
export const forecastFinancials = await withAuth(_forecastFinancials);
export const smartReconcile = await withAuth(_smartReconcile);
export const smartSearch = await withAuth(_smartSearch);
export const generateEmail = await withAuth(_generateEmail);
export const sendEmail = await withAuth(_sendEmail);
export const searchConversations = await withAuth(_searchConversations);
export const shareConversation = await withAuth(_shareConversation);
export const updateConversationTags = await withAuth(_updateConversationTags);
export const regenerateResponse = await withAuth(_regenerateResponse);
export const editMessage = await withAuth(_editMessage);

// Payroll AI
export const suggestSalary = await withAuth(_suggestSalary);
export const analyzePayroll = await withAuth(_analyzePayroll);

// Accounting AI
export const suggestJournalEntry = await withAuth(_suggestJournalEntry);

// Tax AI
export const suggestTaxDeductions = await withAuth(_suggestTaxDeductions);

// Products/Inventory AI
export const forecastDemand = await withAuth(_forecastDemand);
export const optimizePrice = await withAuth(_optimizePrice);

// CRM AI
export const segmentCustomers = await withAuth(_segmentCustomers);
export const scoreLeads = await withAuth(_scoreLeads);

// Projects AI
export const forecastProjectBudget = await withAuth(_forecastProjectBudget);

// Budgeting AI
export const suggestBudget = await withAuth(_suggestBudget);
export const analyzeVariance = await withAuth(_analyzeVariance);

export async function getSharedConversation(shareToken: string) {
  return _getSharedConversation(shareToken);
}
