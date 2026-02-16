import Heading from '@/components/commons/Header';
import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

import { currentUserRole } from '@/lib/helpers/get-user-role';
import { DataTable } from '@/components/table/data-table';
import { currentUser } from '@/lib/helpers/session';
import { getAllDepartments } from '@/lib/actions/department.action';
import { DepartmentModal } from './_components/DepartmentModal';
import { columns } from './_components/column';

const page = async () => {
  const user = await currentUser();

  if (!user) redirect("/");

  const role = await currentUserRole();

  const data = await getAllDepartments() || []

  console.log("departments data", data)
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Manage Departments" description="Manage,create and edit Hub departments" />
        <DepartmentModal />
      </div>
      <Separator />
      <div className="">
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </>
  )
}

export default page