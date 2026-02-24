import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/actions/dashboard.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { SubscriptionWarningBanner } from "@/components/subscription-warning-banner";
import DashboardClient from "./_components/dashboard-client";

type Props = Promise<{ organizationId: string; userId: string }>;

const page = async ({ params }: { params: Props }) => {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("dashboard_view");
  if (!hasViewPermission) redirect("/unauthorized");

  const statsResult = await getDashboardStats();
  const rawStats = statsResult.data || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    activeEmployees: 0,
    pendingInvoices: { count: 0, amount: 0 },
    unpaidBills: { count: 0, amount: 0 },
    bankBalance: { total: 0, accounts: 0 },
    accountHealth: { totalAssets: 0, totalLiabilities: 0, equity: 0 },
    recentTransactions: [],
    topCustomers: [],
    topVendors: [],
    payrollRuns: [],
    monthlyRevenueExpenses: [],
    cashFlowData: [],
  };

  const stats = {
    ...rawStats,
    recentTransactions: rawStats.recentTransactions.map((t: any) => ({
      _id: String(t._id),
      description: t.description,
      amount: t.amount,
      transactionType: t.transactionType,
      transactionDate: t.transactionDate?.toISOString?.() || t.transactionDate,
    })),
    topCustomers: rawStats.topCustomers.map((c: any) => ({
      _id: String(c._id),
      name: c.name,
      totalAmount: c.totalAmount,
    })),
    topVendors: rawStats.topVendors.map((v: any) => ({
      _id: String(v._id),
      name: v.name,
      totalAmount: v.totalAmount,
    })),
    payrollRuns: rawStats.payrollRuns.map((p: any) => ({
      _id: String(p._id),
      payPeriod: p.payPeriod,
      totalAmount: p.totalAmount,
      status: p.status,
    })),
  };

  return (
    <div className="space-y-6">
      <SubscriptionWarningBanner organizationId={organizationId} userId={userId} />
      <DashboardClient initialStats={stats} />
    </div>
  );
};

export default page;
