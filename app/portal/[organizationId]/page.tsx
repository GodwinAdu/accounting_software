import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PortalLoginForm from "./_components/portal-login-form";
import { connectToDB } from "@/lib/connection/mongoose";
import PortalSettings from "@/lib/models/portal-settings.model";
import Organization from "@/lib/models/organization.model";

type Props = Promise<{ organizationId: string }>;

export default async function CustomerPortalPage({ params }: { params: Props }) {
  const { organizationId } = await params;

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const settings = await PortalSettings.findOne({ organizationId });

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Organization not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!settings?.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Customer portal is currently unavailable</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{organization.name}</CardTitle>
          <p className="text-center text-muted-foreground">Customer Portal</p>
        </CardHeader>
        <CardContent>
          <PortalLoginForm organizationId={organizationId} />
        </CardContent>
      </Card>
    </div>
  );
}
