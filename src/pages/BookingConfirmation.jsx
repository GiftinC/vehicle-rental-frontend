import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/BookingConfirmation.css";
import axios from 'axios';

const SERVER = import.meta.env.VITE_SERVER;

const BookingConfirmation = () => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const { bookingId } = location.state || {};

    useEffect(() => {
        if (bookingId) {
            const token = localStorage.getItem("token");
            axios.get(`${SERVER}/booking/${bookingId}`, {
                headers: { authorization: `Bearer ${token}` }
            })
                .then(response => {
                    setBooking(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error Fetching Booking Details", error);
                    setLoading(false);
                });
        } else {
            navigate("/");
        }
    }, [bookingId, navigate]);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${SERVER}/payment/create-checkout-session`,
                { amount: booking.totalAmount, bookingId },
                { headers: { authorization: `Bearer ${token}` } }
            );
            window.location.href = response.data.url; // Redirect to Stripe checkout
        } catch (error) {
            console.error("Error initiating payment:", error);
            alert("Payment initiation failed. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!booking) return <div>Error: Booking not found</div>;

    return (
        <div className="confirmation-page">
            <h2>Booking Confirmation</h2>
            <div className="booking-details">
                <h3>Booking ID: {booking._id}</h3>
                <div><strong>Vehicle:</strong> {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}</div>
                <div><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</div>
                <div><strong>Total Amount:</strong> ${booking.totalAmount}</div>
                <div><strong>Status:</strong> {booking.status || "Pending"}</div>
            </div>
            <div className="buttons">
                <button onClick={handlePayment}>Proceed to Payment</button>
                <button onClick={() => navigate("/vehicles")}>View More Vehicles</button>
                <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                <button onClick={() => navigate("/booking/my-bookings")}>My Bookings</button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
