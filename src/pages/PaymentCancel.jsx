import { useLocation, useNavigate } from "react-router-dom";
import "../pages/PaymentCancel.css";

const PaymentCancel = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingId = new URLSearchParams(location.search).get("bookingId");

    return (
        <div className="payment-cancel">
            <h2>Payment Canceled</h2>
            <p>It seems like you canceled the payment process. Your booking status is still pending.</p>
            <div className="buttons">
                <button onClick={() => navigate("/booking-confirmation", { state: { bookingId } })}>
                    Retry Payment
                </button>
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
        </div>
    );
};

export default PaymentCancel;
