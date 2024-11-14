import { useContext } from "react";
import BookingContext from "../../context/BookingContext.jsx";

const BookingList = () => {
    const { bookings, loading, cancelBooking, error } = useContext(BookingContext);

    if (loading) {
        return <div>Loading Bookings...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (bookings.length === 0) {
        return <div>No Bookings Found</div>;
    }

    return (
        <div>
            <h2>Your Bookings</h2>
            {bookings.map((booking) => (
                <div key={booking._id}>
                    <h3>{booking.vehicle?.make || "Vehicle Information Unavailable"} {booking.vehicle.model} {booking.vehicle.year}</h3>
                    <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p>Total Amount: ${booking.totalAmount}</p>
                    <p>Status: {booking.status}</p>
                    {booking.status !== "Confirmed" && booking.status !== "Cancelled" && (
    <button onClick={() => cancelBooking(booking._id)}>Cancel Booking</button>
)}

                </div>
            ))}
        </div>
    );
};

export default BookingList;
