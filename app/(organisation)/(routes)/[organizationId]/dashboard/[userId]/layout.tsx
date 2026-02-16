import Navbar from "@/components/commons/Navbar";
import AppSidebarMain from "@/components/sidebar/app-sidebar-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { currentUser } from "@/lib/helpers/session";
import { fetchOrganizationUserById } from "@/lib/actions/organization.action";




export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();
  
    let pro = false;
    if (user) {
        try {
            const org = await fetchOrganizationUserById();
            pro = org?.subscriptionPlan?.status === "active" || org?.subscriptionPlan?.status === "trial";
        } catch (error) {
            console.error("Failed to fetch organization:", error);
        }
    }


    return (
        
               
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
            
    );
}