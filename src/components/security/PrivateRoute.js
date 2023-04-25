
import { Navigate, Outlet } from "react-router-dom";

// Secure Data (Local Storage)
import secureLocalStorage from  "react-secure-storage"; 

const PrivateRoute = () => {

    // jwt
    const token = secureLocalStorage.getItem("token");

    return token?.split(" ").join("") ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;