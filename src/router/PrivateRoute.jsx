import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PrivateRoute = () => {
    const accessToken = useAuthStore((state) => state.accessToken);

    if (!accessToken) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
