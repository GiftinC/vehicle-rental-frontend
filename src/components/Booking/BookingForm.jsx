import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_SERVER;

const BookingForm = ({ vehicle }) => {
    const year = vehicle.year.toString();
    const make = vehicle.make.charAt(0).toUpperCase() + vehicle.make.slice(1);
    const model = vehicle.model.charAt(0).toUpperCase() + vehicle.model.slice(1);
    
    console.log("Received vehicle in BookingForm:", vehicle);

    const [vehicleId, setVehicleId] = useState(vehicle ? vehicle._id : "");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    const handleBookingSuccess = (bookingId) => {
        // Navigate to the confirmation page and pass bookingId
        navigate("/booking/confirmation", { state: { bookingId } });
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj >= endDateObj) {
            alert("End Date must be after Start Date");
            return;
        }

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to make a booking");
            return;
        }

        // Make booking request
        try {
            const response = await axios.post(`${SERVER}/booking/book`, {
                vehicleId,
                startDate,
                endDate,
            }, {
                headers: { authorization: `Bearer ${token}` }
            });
            
            const bookingId = response.data.bookingId;
            if (bookingId) {
                alert(`Booking Created Successfully! Your booking ID is ${bookingId}`);
                handleBookingSuccess(bookingId);
            } else {
                alert("Booking creation failed, no booking ID returned.");
            }
        } catch (error) {
            console.error("Error Creating Booking:", error);
            const message = error.response?.data?.message || "Error Creating Booking";
            alert(message);
        }
    };

    return (
        <form onSubmit={handleBooking}>
            <h4 style={{paddingTop: "30px"}}>Selected Vehicle : <b>{make} {model} {year}</b></h4>
            <label style={{fontSize:"0.8em"}}>ID of Selected Vehicle : </label>
            <input
                type="text"
                placeholder="Vehicle ID"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
                readOnly
                style={{fontSize:"0.8em"}}
            />
                    <label style={{fontSize:"0.8em"}}>Select Start Date : </label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{fontSize:"0.8em"}}
            />
                    <label style={{fontSize:"0.8em"}}>Select End Date : </label>

            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{fontSize:"0.8em"}}
            />
            <button type="submit"
                                style={{fontSize:"1em"}}
            >Create Booking
            </button>
        </form>
    );
};

// PropTypes validation
BookingForm.propTypes = {
    vehicle: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        make: PropTypes.string.isRequired,
        model: PropTypes.string.isRequired,
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        rentalPrice: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
    }).isRequired,
};

export default BookingForm;
