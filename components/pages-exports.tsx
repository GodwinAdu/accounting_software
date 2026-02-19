import { FileCheck, Building2, Warehouse, ArrowLeftRight, Bell, Calendar, Briefcase, Clock, DollarSign, TrendingUp, Users, BarChart3, UsersRound, Target, Calculator, Boxes, BookOpen, Lightbulb } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

// Accounting Pages
export function PeriodClosePage() {
  return <ComingSoon title="Period Close" description="Close accounting periods and lock transactions" icon={FileCheck} isNew features={["Period locking", "Closing checklists", "Adjusting entries", "Period reports", "Audit trail", "Reopen periods"]} />;
}

export function MultiEntityPage() {
  return <ComingSoon title="Multi-Entity Consolidation" description="Manage multiple entities and consolidate financials" icon={Building2} isPro features={["Multi-company management", "Consolidated reports", "Inter-company transactions", "Entity switching", "Elimination entries", "Consolidated P&L"]} />;
}

// Products Pages
export function WarehousesPage() {
  return <ComingSoon title="Warehouses" description="Manage multiple warehouse locations" icon={Warehouse} isNew features={["Multiple locations", "Stock per warehouse", "Warehouse transfers", "Location tracking", "Warehouse reports", "Stock valuation"]} />;
}

export function StockTransferPage() {
  return <ComingSoon title="Stock Transfer" description="Transfer inventory between warehouses" icon={ArrowLeftRight} isNew features={["Transfer requests", "Transfer approvals", "In-transit tracking", "Transfer history", "Cost adjustments", "Transfer reports"]} />;
}

export function ReorderAlertsPage() {
  return <ComingSoon title="Reorder Alerts" description="Automatic alerts for low stock items" icon={Bell} isNew features={["Reorder level settings", "Email notifications", "Purchase suggestions", "Supplier recommendations", "Reorder history", "Stock forecasting"]} />;
}

export function BatchExpiryPage() {
  return <ComingSoon title="Batch & Expiry Tracking" description="Track product batches and expiry dates" icon={Calendar} isPro features={["Batch numbers", "Expiry date tracking", "FIFO/FEFO management", "Expiry alerts", "Batch reports", "Recall management"]} />;
}

// Projects Pages
export function ProjectsAllPage() {
  return <ComingSoon title="Projects" description="Manage projects and track profitability" icon={Briefcase} isNew features={["Project creation", "Task management", "Budget tracking", "Time tracking", "Expense allocation", "Project invoicing"]} />;
}

export function ProjectTimePage() {
  return <ComingSoon title="Project Time Tracking" description="Track time spent on projects" icon={Clock} isNew features={["Time entries", "Billable hours", "Time approvals", "Timesheet reports", "Project costing", "Team utilization"]} />;
}

export function ProjectBudgetsPage() {
  return <ComingSoon title="Project Budgets" description="Set and monitor project budgets" icon={DollarSign} isNew features={["Budget allocation", "Budget vs actual", "Cost tracking", "Budget alerts", "Variance analysis", "Budget reports"]} />;
}

export function ProjectProfitabilityPage() {
  return <ComingSoon title="Project Profitability" description="Analyze project profitability and margins" icon={TrendingUp} isNew features={["Revenue tracking", "Cost analysis", "Profit margins", "ROI calculations", "Profitability reports", "Project comparison"]} />;
}

// CRM Pages
export function LeadsPage() {
  return <ComingSoon title="Leads" description="Manage sales leads and opportunities" icon={Users} isNew features={["Lead capture", "Lead scoring", "Lead assignment", "Follow-up tasks", "Lead conversion", "Lead reports"]} />;
}

export function OpportunitiesPage() {
  return <ComingSoon title="Opportunities" description="Track sales opportunities and deals" icon={TrendingUp} isNew features={["Deal pipeline", "Win probability", "Deal stages", "Revenue forecasting", "Activity tracking", "Opportunity reports"]} />;
}

export function SalesPipelinePage() {
  return <ComingSoon title="Sales Pipeline" description="Visualize and manage your sales pipeline" icon={BarChart3} isNew features={["Pipeline stages", "Drag & drop deals", "Pipeline metrics", "Conversion rates", "Sales forecasting", "Pipeline reports"]} />;
}

export function ContactsPage() {
  return <ComingSoon title="Contacts" description="Manage customer and prospect contacts" icon={UsersRound} isNew features={["Contact database", "Contact history", "Communication log", "Contact segmentation", "Email integration", "Contact reports"]} />;
}

// Budgeting Pages
export function AnnualBudgetPage() {
  return <ComingSoon title="Annual Budget" description="Create and manage annual budgets" icon={Calendar} isPro features={["Budget templates", "Multi-year planning", "Budget versions", "Approval workflow", "Budget allocation", "Variance analysis"]} />;
}

export function DepartmentBudgetsPage() {
  return <ComingSoon title="Department Budgets" description="Budget planning by department" icon={Building2} isPro features={["Department allocation", "Cost center budgets", "Budget requests", "Department reports", "Budget tracking", "Spend analysis"]} />;
}

export function ForecastingPage() {
  return <ComingSoon title="Forecasting" description="Financial forecasting and scenario planning" icon={TrendingUp} isPro features={["Revenue forecasting", "Expense projections", "Cash flow forecast", "Scenario modeling", "What-if analysis", "Forecast reports"]} />;
}

export function BudgetVariancePage() {
  return <ComingSoon title="Budget vs Actual" description="Compare budget to actual performance" icon={BarChart3} isPro features={["Variance analysis", "Budget performance", "Trend analysis", "Drill-down reports", "Alert notifications", "Executive dashboards"]} />;
}

// Fixed Assets Pages
export function AssetRegisterPage() {
  return <ComingSoon title="Asset Register" description="Maintain a complete register of fixed assets" icon={Boxes} features={["Asset tracking", "Asset details", "Purchase info", "Location tracking", "Asset tagging", "Asset reports"]} />;
}

export function DepreciationPage() {
  return <ComingSoon title="Depreciation" description="Calculate and track asset depreciation" icon={TrendingUp} features={["Depreciation methods", "Automatic calculations", "Depreciation schedules", "Disposal tracking", "Depreciation reports", "Tax depreciation"]} />;
}

export function AssetCategoriesPage() {
  return <ComingSoon title="Asset Categories" description="Organize assets by category" icon={BookOpen} features={["Category management", "Depreciation rules", "Useful life settings", "Category reports", "Asset classification", "Category budgets"]} />;
}

// AI Assistant Page
export function AIAssistantPage() {
  return <ComingSoon title="AI Assistant" description="Smart financial insights and recommendations" icon={Lightbulb} isNew isPro features={["Smart categorization", "Financial health score", "Cash flow predictions", "Fraud detection", "Tax optimization", "AI chatbot"]} />;
}
