import {Link, useNavigate, useLocation } from 'react-router-dom';
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const hiddenPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/reset-confirmation", "/", "*"];
    const notHiddenPaths = ["/dashboard", "/booking/my-bookings"];
    const forVehiclePath = ["/vehicles"]

    const showLogoutButton = !hiddenPaths.includes(location.pathname);
    const showButtons = notHiddenPaths.includes(location.pathname);
    const forVehicle = forVehiclePath.includes(location.pathname);

    return (
        <nav className='navStyle'>
            {showLogoutButton && (
                <button onClick={handleLogout} className='logoutButtonStyle'>Logout</button>
            )}
            {showButtons && (
             <div style={{ display: "flex", flexDirection: "column" }}>
                <Link to="/vehicles">Vehicles</Link>
               </div>
            )}
            {forVehicle && (
                <>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>To View Dashboard</label>
                        
                <Link to="/dashboard"><b>Dashboard</b></Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Booking History</label>
                <Link to="/booking/my-bookings"><b>My Bookings</b></Link>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Update your Profile</label>
                <Link to="/profile"><b>My Profile</b></Link>
                    </div>

                </>       
            )}

             
        </nav>
    );
};

export default Navbar;
