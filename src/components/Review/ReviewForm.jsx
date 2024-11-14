import { useState, useEffect } from "react";
import axios from "axios";
import propTypes from "prop-types";

const SERVER = import.meta.env.VITE_SERVER;

const ReviewForm = ({ vehicleId, onReviewSubmit, reviewToEdit, onCancelEdit }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (reviewToEdit) {
            setRating(reviewToEdit.rating);
            setComment(reviewToEdit.comment);
            setIsEditing(true);
        } else {
            setRating(1);
            setComment("");
            setIsEditing(false);
        }
    }, [reviewToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `${SERVER}/reviews/${reviewToEdit._id}`
                : `${SERVER}/reviews/${vehicleId}`;
            const method = isEditing ? "put" : "post";
            
            await axios[method](url, { rating, comment }, {
                headers: { Authorization: `BEARER ${localStorage.getItem("token")}` }
            });
    
            setRating(1);
            setComment("");
            setIsEditing(false);
            onReviewSubmit();
            alert(isEditing ? "Review updated successfully!" : "Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review", error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
            <label>Comment:</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            <button type="submit">{isEditing ? "Update Review" : "Submit Review"}</button>
            {isEditing && <button type="button" onClick={onCancelEdit}>Cancel</button>}
        </form>
    );
};

ReviewForm.propTypes = {
    vehicleId: propTypes.string.isRequired,
    onReviewSubmit: propTypes.func.isRequired,
    reviewToEdit: propTypes.object,
    onCancelEdit: propTypes.func.isRequired
};

export default ReviewForm;
