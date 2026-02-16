import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CreateRoleForm from "../_components/CreateRoleForm";
import Heading from "@/components/commons/Header";
import { currentUser } from "@/lib/helpers/session";
import Organization from "@/lib/models/organization.model";
import { connectToDB } from "@/lib/connection/mongoose";

const page = async ({ params }: { params: Promise<{ organizationId: string, userId: string }> }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/")
  }

  const { organizationId, userId } = await params;

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const enabledModules = organization?.modules || {};

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading
          title="Create Role"
          description="Add new role with custom permissions"
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
      <CreateRoleForm enabledModules={enabledModules} type="create" />
    </>
  );
};

export default page;