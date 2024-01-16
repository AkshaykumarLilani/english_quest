import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import { useSelector } from "react-redux";

const AllRoutes = () => {

    const token = useSelector(store => store.auth.token);
    const isAuthenticated = useSelector(store => store.auth.isAuthenticated);

    axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

    if (isAuthenticated){
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    if (isAuthenticated){
        return <ProtectedRoutes />;
    } else {
        return <AuthRoutes />;
    }
}

export default AllRoutes;