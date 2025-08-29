import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import Layout from "../layout/Layout"
import LoginPage from "../pages/auth/LoginPage"
import RegisterPage from "../pages/auth/RegisterPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import EmployeeListPage from "../pages/employees/EmployeeListPage"
import EmployeeFormPage from "../pages/employees/EmployeeFormPage"
import ChangePasswordPage from "../pages/auth/ChangePasswordPage"

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<DashboardPage />}/>
                        <Route path="/employees" element={<EmployeeListPage />} />
                        <Route path="/form-builder" element={<EmployeeFormPage />} />
                        <Route path="/change-password" element={<ChangePasswordPage />} />
                    </Route>
                </Route>    
            </Routes>
        </Router>
    )
}

export default AppRoutes;