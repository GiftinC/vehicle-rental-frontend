import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import BookingForm from "./Booking/BookingForm.jsx";
import ReviewForm from "./Review/ReviewForm.jsx";
import ReviewList from "./Review/ReviewList.jsx";
import "./VehicleList.css";

const SERVER = import.meta.env.VITE_SERVER;

const VehicleList = () => {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [reviewSections, setReviewSections] = useState({});
    const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
    const [reviewToEdit, setReviewToEdit] = useState(null);
    const [filters, setFilters] = useState({ make: "", model: "", minPrice: "", maxPrice: "", year: "" });
    const [filterApplied, setFilterApplied] = useState(false);

    const bookingFormRef = useRef(null); // Ref for BookingForm component

    const fetchVehicles = useCallback(() => {
        axios.get(`${SERVER}/vehicles`)
            .then(response => {
                setVehicles(response.data);
                setFilteredVehicles(response.data);
            })
            .catch(error => console.error("Error Fetching Vehicles", error));
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handleOpenBookingForm = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowBookingForm(true);

        // Scroll to the BookingForm component
        setTimeout(() => {
            bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleToggleReviews = (vehicleId) => {
        setReviewSections((prev) => ({
            ...prev,
            [vehicleId]: !prev[vehicleId],
        }));
    };

    const handleReviewSubmit = () => {
        setReviewRefreshTrigger((prev) => prev + 1);
        setReviewToEdit(null);
    };

    const handleEditReview = (review) => {
        setReviewToEdit(review);
    };

    const handleCancelEdit = () => {
        setReviewToEdit(null);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = useCallback(() => {
        setFilteredVehicles(
            vehicles.filter(vehicle => 
                (filters.make ? vehicle.make.toLowerCase().includes(filters.make.toLowerCase()) : true) &&
                (filters.model ? vehicle.model.toLowerCase().includes(filters.model.toLowerCase()) : true) &&
                (filters.minPrice ? vehicle.rentalPrice >= parseInt(filters.minPrice, 10) : true) &&
                (filters.maxPrice ? vehicle.rentalPrice <= parseInt(filters.maxPrice, 10) : true) &&
                (filters.year ? vehicle.year === parseInt(filters.year, 10) : true)
            )
        );
        setFilterApplied(true); // Indicate that filters have been applied
    }, [vehicles, filters]);

    const clearFilters = () => {
        setFilters({ make: "", model: "", minPrice: "", maxPrice: "", year: "" });
        setFilteredVehicles(vehicles); // Reset filtered vehicles to the full list
        setFilterApplied(false); // Reset the filter applied state
    };

    useEffect(() => {
        if (filterApplied) {
            applyFilters();
        }
    }, [applyFilters, filterApplied]);

    return (
        <div className="vehicle-list-container">
            <h2>Available Vehicles: {filteredVehicles.length}</h2>
            
            <div className="filter-container">
                <input
                    type="text"
                    name="make"
                    placeholder="Filter by Make"
                    value={filters.make}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="model"
                    placeholder="Filter by Model"
                    value={filters.model}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Rental Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Rental Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="year"
                    placeholder="Filter by Year"
                    value={filters.year}
                    onChange={handleFilterChange}
                />
                <button onClick={() => setFilterApplied(true)}>Apply Filters</button>
                <button onClick={clearFilters}>Clear Filters</button>
            </div>

            <div className="card-container">
                {filteredVehicles.map(vehicle => (
                    <div className="card" key={vehicle._id}>
                    <div className="card-body">
                        <img src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} className="vehicle-image" />
                        <h3 className="card-title">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                        </h3>
                        <p className="card-text">
                            Rental Price: ${vehicle.rentalPrice}/day
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleOpenBookingForm(vehicle)}
                        >
                            Book Vehicle
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleToggleReviews(vehicle._id)}
                        >
                            {reviewSections[vehicle._id] ? "Hide Reviews" : "Show Reviews"}
                        </button>
                        </div>
                        
                        {reviewSections[vehicle._id] && (
                            <div className="review-section">
                                <ReviewForm
                                    vehicleId={vehicle._id}
                                    onReviewSubmit={handleReviewSubmit}
                                    reviewToEdit={reviewToEdit}
                                    onCancelEdit={handleCancelEdit} // Added the onCancelEdit prop
                                />
                                <ReviewList
                                    vehicleId={vehicle._id}
                                    refreshTrigger={reviewRefreshTrigger}
                                    onEditReview={handleEditReview}
                                    onDeleteReview={handleReviewSubmit}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showBookingForm && selectedVehicle && (
                <div ref={bookingFormRef}>
                    <BookingForm vehicle={selectedVehicle} onClose={() => setShowBookingForm(false)} />
                </div>
            )}
        </div>
    );
};

export default VehicleList;
