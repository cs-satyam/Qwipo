import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Accept both legacy and new token keys
    const isAuthenticated = localStorage.getItem("token") || localStorage.getItem("authToken");

    // ✅ JSX branches wrapped in parentheses
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" replace={true} />
    );
};

export default ProtectedRoute;
