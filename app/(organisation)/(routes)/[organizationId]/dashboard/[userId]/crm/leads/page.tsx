import { getAllLeads } from "@/lib/actions/lead.action";
import LeadsClient from "./_components/leads-client";


export default async function LeadsPage() {
  const { leads = [] } = await getAllLeads();

  return <LeadsClient initialLeads={leads} />;
}
