// ProtectedRoute.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        // Log the token for debugging
       // console.log("ProtectedRoute - Token:", token);

        // Redirect to login if there's no token
        if (!token) {
            console.log("No token found, redirecting to login.");
            navigate('/login');
        }
    }, [token, navigate]);

    // Only render children if the token exists
    return token ? children : null;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
