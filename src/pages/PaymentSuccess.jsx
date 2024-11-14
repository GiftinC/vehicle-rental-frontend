import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SERVER = import.meta.env.VITE_SERVER;

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingId = new URLSearchParams(location.search).get("bookingId");

    useEffect(() => {
        if (bookingId) {
            const token = localStorage.getItem("token");
            axios.put(
                `${SERVER}/booking/confirm/${bookingId}`,
                { status: "Confirmed" },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => {
                   // console.log("Booking status updated to Confirmed.");
                })
                .catch((error) => {
                    console.error("Error updating booking status:", error);
                    alert("Failed to confirm booking. Please contact support.");
                });
        } else {
            navigate("/"); // Redirect to home if no bookingId is found
        }
    }, [bookingId, navigate]);

    return (
        <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed.</p>
            <button onClick={() => navigate("/booking/my-bookings")}>
                View My Bookings
            </button>
            <button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
            </button>
            <button onClick={() => navigate("/vehicles")}>
                Browse More Vehicles
            </button>
        </div>
    );
};

export default PaymentSuccess;
