import { Suspense } from "react"
import { TableLoader, FormLoader, DashboardLoader, DetailsLoader, ListLoader, GridLoader, ReportLoader } from "@/components/commons/PageLoader"

// Example 1: Table Page with Loading
export default function ExampleTablePage() {
  return (
    <Suspense fallback={<TableLoader />}>
      {/* Your actual table content */}
    </Suspense>
  )
}

// Example 2: Form Page with Loading
export function ExampleFormPage() {
  return (
    <Suspense fallback={<FormLoader />}>
      {/* Your actual form content */}
    </Suspense>
  )
}

// Example 3: Dashboard with Loading
export function ExampleDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      {/* Your actual dashboard content */}
    </Suspense>
  )
}

// Example 4: Details Page with Loading
export function ExampleDetailsPage() {
  return (
    <Suspense fallback={<DetailsLoader />}>
      {/* Your actual details content */}
    </Suspense>
  )
}

// Example 5: List Page with Loading
export function ExampleListPage() {
  return (
    <Suspense fallback={<ListLoader />}>
      {/* Your actual list content */}
    </Suspense>
  )
}

// Example 6: Grid Page with Loading
export function ExampleGridPage() {
  return (
    <Suspense fallback={<GridLoader />}>
      {/* Your actual grid content */}
    </Suspense>
  )
}

// Example 7: Report Page with Loading
export function ExampleReportPage() {
  return (
    <Suspense fallback={<ReportLoader />}>
      {/* Your actual report content */}
    </Suspense>
  )
}

// Example 8: Using with async component
async function DataTable() {
  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 2000))
  return <div>Your data table here</div>
}

export function PageWithAsyncData() {
  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<TableLoader />}>
        <DataTable />
      </Suspense>
    </div>
  )
}
