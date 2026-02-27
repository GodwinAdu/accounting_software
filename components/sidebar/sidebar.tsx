
import { NavMain } from './nav-main'



const SideContent = ({ role, organization, userRole }: { role: any, organization: any, userRole: string }) => {

    return (
        <>
            <NavMain organization={organization} role={role} userRole={userRole} />
        </>
    )
}

export default SideContent