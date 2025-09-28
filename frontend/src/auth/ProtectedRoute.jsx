import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const isAuthenticated = localStorage.getItem("token") || localStorage.getItem("authToken");


    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" replace={true} />
    );
};

export default ProtectedRoute;
