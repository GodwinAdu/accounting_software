import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchRoleById } from "@/lib/actions/role.action";
import Heading from "@/components/commons/Header";
import { currentUser } from "@/lib/helpers/session";
import CreateRoleForm from "../_components/CreateRoleForm";
import Organization from "@/lib/models/organization.model";
import { connectToDB } from "@/lib/connection/mongoose";

type Props = Promise<{ organizationId: string, userId: string, roleId: string }>

const page = async ({ params }: { params: Props}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/")
  }

  const { organizationId, userId, roleId } = await params;

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const enabledModules = JSON.parse(JSON.stringify(organization?.modules || {}));

  const initialData = await fetchRoleById(roleId);

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Update Role"
          description="Manage role and update permissions"
        />

        <Link
          href={`/${organizationId}/dashboard/${userId}/settings/roles`}
          className={cn(buttonVariants())}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>
      <Separator />
      <CreateRoleForm type="update" initialData={initialData} enabledModules={enabledModules} />
    </>
  )
}

export default page