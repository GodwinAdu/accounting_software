import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { EditProfileForm } from "./_components/edit-profile-form";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function EditProfilePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading title="Edit Profile" description="Update your personal information" />
      <Separator />
      <EditProfileForm user={user} organizationId={organizationId} userId={userId} />
    </div>
  );
}
