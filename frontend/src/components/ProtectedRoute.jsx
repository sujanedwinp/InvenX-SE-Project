import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { token, isLoading } = useAuth();

    // While AuthContext is restoring session from localStorage / fetching /me,
    // render nothing (avoids a false redirect before auth state is known).
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return token ? <Outlet /> : <Navigate to="/login" replace />;
}
