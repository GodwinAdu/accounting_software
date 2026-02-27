import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/helpers/session';
import { getAllDepartments } from '@/lib/actions/department.action';
import { DepartmentModal } from './_components/DepartmentModal';
import { columns } from './_components/column';
import { DataTable } from '@/components/table/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users } from 'lucide-react';

const page = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  const data = await getAllDepartments() || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Departments
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage organizational departments and teams
          </p>
        </div>
        <DepartmentModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Total Departments</CardDescription>
            <CardTitle className="text-3xl font-bold">{data.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Active</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">{data.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium">Teams</CardDescription>
            <CardTitle className="text-3xl font-bold">{data.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>View and manage all departments in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable searchKey="name" columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  )
}

export default page