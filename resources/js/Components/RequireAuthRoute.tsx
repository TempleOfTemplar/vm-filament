import {withSanctum} from "react-sanctum";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const RequireAuth = ({authenticated})=> {
    let location = useLocation();

    if (!authenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <Outlet />;
}
export default withSanctum(RequireAuth);
