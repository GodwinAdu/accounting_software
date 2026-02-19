import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getCashForecast } from "@/lib/actions/cash-forecast.action";
import CashForecastView from "./_components/cash-forecast-view";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CashForecastPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("cashForecast_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getCashForecast();
  const forecast = result.success ? result.data : null;

  return (
    <div className="space-y-6">
      <Heading title="Cash Forecast" description="Predict future cash flow and avoid shortages" />
      <Separator />
      <CashForecastView forecast={forecast} />
    </div>
  );
}
