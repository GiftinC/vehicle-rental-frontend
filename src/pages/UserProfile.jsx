import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_SERVER;

const UserProfile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${SERVER}/user/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then((response) => {
                setName(response.data.name);
                setEmail(response.data.email);
                setAvatar(response.data.avatar);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching profile", error);
                if (error.response?.status === 401) {
                    navigate("/login"); // Redirect if not authenticated
                }
            });
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedData = { name, email, avatar };

        axios
            .put(`${SERVER}/user/profile`, updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                alert("Profile updated successfully");
                setTimeout(() => {
                    navigate('/login');
                  }, 1000); // 3-second delay before redirecting to login
            })
            .catch((error) => {
                console.error("Error updating profile", error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Avatar URL:</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default UserProfile;
