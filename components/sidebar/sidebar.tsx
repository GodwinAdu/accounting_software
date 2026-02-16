
import { NavMain } from './nav-main'



const SideContent = ({ role, organization }: { role:any, organization:any }) => {

    return (
        <>
            <NavMain organization={organization} role={role} />
        </>
    )
}

export default SideContent