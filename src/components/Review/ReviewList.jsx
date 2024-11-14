import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import propTypes from "prop-types";

const SERVER = import.meta.env.VITE_SERVER;

const ReviewList = ({ vehicleId, refreshTrigger, onEditReview, onDeleteReview }) => {
    const [reviews, setReviews] = useState([]);

    const fetchReviews = useCallback(async () => {
        try {
            const response = await axios.get(`${SERVER}/reviews/${vehicleId}`, {
                headers: { Authorization: `BEARER ${localStorage.getItem("token")}` }
            });
            setReviews(response.data);
        } catch (error) {
            console.error("Error Fetching Reviews", error);
        }
    }, [vehicleId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews, refreshTrigger]);

    const handleDelete = async (reviewId) => {
        try {
            await axios.delete(`${SERVER}/reviews/${reviewId}`, {
                headers: { Authorization: `BEARER ${localStorage.getItem("token")}` }
            });
            onDeleteReview();
            alert("Review deleted successfully!");
            fetchReviews();
        } catch (error) {
            console.error("Error deleting review", error);
        }
    };

    return (
        <div>
            <h3>User Reviews:</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review._id}>
                        <p>Rating: {review.rating} /5</p>
                        <p>Review: {review.comment}</p>
                        <small>by {review.user.name}</small>
                        <button onClick={() => onEditReview(review)}>Edit</button>
                        <button onClick={() => handleDelete(review._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No Reviews Yet...</p>
            )}
        </div>
    );
};

ReviewList.propTypes = {
    vehicleId: propTypes.string.isRequired,
    refreshTrigger: propTypes.number.isRequired,
    onEditReview: propTypes.func.isRequired,
    onDeleteReview: propTypes.func.isRequired
};

export default ReviewList;
