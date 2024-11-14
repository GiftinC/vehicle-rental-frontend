import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";

const SERVER = import.meta.env.VITE_SERVER;

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch all bookings
    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await axios.get(`${SERVER}/booking/my-bookings`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            // Check if the bookings list is empty
            if (response.data.length === 0) {
                setError("There are no booking Records.");
                setBookings([]);
            } else {
                setBookings(response.data); // Set bookings if data exists
            }
    
        } catch (error) {
            console.error("Error fetching bookings", error);
            setError("Failed to fetch bookings. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    

    // Function to cancel a booking
    const cancelBooking = async (bookingId) => {
        try {
            await axios.delete(`${SERVER}/booking/cancel/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // After canceling, we update the state to reflect the change immediately
            setBookings((prevBookings) => prevBookings.filter((b) => b._id !== bookingId));

            alert("Booking canceled Successfully")

            // Optionally refetch bookings from server to ensure data sync
            fetchBookings();
        } catch (error) {
            console.error("Error canceling booking", error);
            setError("Failed to cancel booking. Please try again later.");
        }
    };

    // Fetch bookings when the component mounts
    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <BookingContext.Provider value={{ bookings, loading, cancelBooking, error }}>
            {children}
        </BookingContext.Provider>
    );
};

BookingProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default BookingContext;
