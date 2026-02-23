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
  const stats = statsResult.data || {
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

  return (
    <div className="space-y-6">
      <SubscriptionWarningBanner organizationId={organizationId} userId={userId} />
      <DashboardClient initialStats={stats} />
    </div>
  );
};

export default page;
