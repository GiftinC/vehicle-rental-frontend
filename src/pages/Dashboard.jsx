import { useState, useEffect } from "react";
import axios from "axios";
import './Dashboard.css';

const SERVER = import.meta.env.VITE_SERVER;

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${SERVER}/user/dashboard`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((response) => {
           // console.log("Dashboard data:", response.data);
            setUserData(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error Fetching Dashboard Data", error);
        });
    }, []);
    

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="dashboard-overview">
                <h3>Booking Overview</h3>
                <p>Total Bookings: {userData.totalBookings}</p>
                <p>Total Spent: ${userData.totalSpent}</p>
            </div>
            <div className="booking-list">
                <h3>Your Bookings</h3>
                {userData.bookings.map((booking) => (
                    <div className="booking-item" key={booking._id}>
                        <p><span>Vehicle:</span> {booking.vehicle.make} {booking.vehicle.model} ({booking.vehicle.year})</p>
                        <p><span>Status:</span> {booking.status}</p>
                        <p><span>Start Date:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
                        <p><span>End Date:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
