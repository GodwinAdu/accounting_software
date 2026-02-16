import { protectPage } from "@/lib/helpers/protect-page";
import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";

// Example: Protect invoice creation page
export default async function CreateInvoicePage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Check if user has permission to create invoices
  await protectPage({ 
    permission: "invoices_create",
    redirectTo: `/${user.organizationId}/dashboard/${user._id}`
  });

  return (
    <div>
      <h1>Create Invoice</h1>
      {/* Your invoice form here */}
    </div>
  );
}
