import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/Auth/Login/LoginPage";
import SignUpPage from "../Pages/Auth/SignUp/SignUpPage";

const AuthRoutes = () => {

    return (
        <Routes>
            <Route path="" element={<LoginPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
    )
}

export default AuthRoutes;