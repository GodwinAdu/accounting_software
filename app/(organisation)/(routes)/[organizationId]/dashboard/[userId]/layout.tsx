import Navbar from "@/components/commons/Navbar";
import AppSidebarMain from "@/components/sidebar/app-sidebar-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/lib/helpers/session";
import { fetchOrganizationUserById } from "@/lib/actions/organization.action";
import { OrganizationSettingsProvider } from "@/providers/organization-settings-provider";
import { getOrganizationSettings } from "@/lib/helpers/organization";




export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();
  
    let pro = false;
    let settings = null;
    if (user) {
        try {
            const org = await fetchOrganizationUserById();
            pro = org?.subscriptionPlan?.status === "active" || org?.subscriptionPlan?.status === "trial";
            settings = await getOrganizationSettings();
        } catch (error) {
            console.error("Failed to fetch organization:", error);
        }
    }

    const defaultSettings = {
        timezone: "Africa/Accra",
        currency: "GHS",
        fiscalYearStart: "01-01",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
        language: "en",
        numberFormat: "1,234.56",
        weekStart: "Monday",
        paymentSettings: {
            acceptedPaymentMethods: [],
            paymentTerms: 30,
            lateFeePercentage: 0,
            earlyPaymentDiscount: 0,
        },
        invoiceSettings: {
            invoicePrefix: "INV",
            invoiceNumberFormat: "INV-{YYYY}-{####}",
            nextInvoiceNumber: 1,
            showTaxNumber: true,
            showLogo: true,
        },
        taxSettings: {
            taxRegistered: false,
            taxRate: 0,
            enableTaxCalculation: true,
        },
        payrollSettings: {
            payrollFrequency: "monthly",
            overtimeRate: 1.5,
            enableTimeTracking: true,
            enableLeaveManagement: true,
            defaultWorkingHours: 8,
            defaultWorkingDays: 5,
        },
        emailSettings: {
            enableEmailNotifications: true,
        },
    };


    return (
        <OrganizationSettingsProvider settings={settings || defaultSettings}>
            <SidebarProvider className="sidebar">
                <AppSidebarMain />
                <SidebarInset >
                    <Navbar  user={user} pro={pro} />
                    <div className="relative scrollbar-hide">
                        <div id="main-content" className="py-4 px-4 overflow-hidden scrollbar-hide">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </OrganizationSettingsProvider>
    );
}