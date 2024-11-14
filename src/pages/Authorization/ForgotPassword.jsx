import { useState } from "react";
import api from '../../apis/api.js';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/forgot-password', { email });
            setMessage(response.data.message);
            setLoading(false);
            
            // navigate to a Reset confirmation page after success
            navigate('/reset-confirmation');
        } catch (error) {
            setMessage('Error sending reset link: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

   return (
        <div className="compdiv">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
           {message && <p>{message}</p>}
           <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
};

export default ForgotPassword;
