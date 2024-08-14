import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ Component }) => {
    const navigate = useNavigate();
    // const { isLoggedIn } = useAuth(); // Optional, if using context
    const isLoggedIn = localStorage.getItem("login");

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    return (
        isLoggedIn ? <Component /> : null
    );
};

export default ProtectedRoute;
