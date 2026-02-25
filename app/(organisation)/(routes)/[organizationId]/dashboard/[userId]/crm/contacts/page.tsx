import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getAllContacts } from "@/lib/actions/contact.action";
import ContactsList from "../_components/contacts-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("contacts_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("contacts_create");

  const result = await getAllContacts();
  const contacts = result.success ? (result.contacts || []) : [];

  return (
    <div className="space-y-6">
      <Heading title="Contacts" description="Manage customer contacts and relationships" />
      <Separator />
      <ContactsList contacts={contacts} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
