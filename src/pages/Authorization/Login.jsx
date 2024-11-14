import { useState } from 'react';
import api from '../../apis/api.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await api.post('/login', { email, password });
    
            if (response.status === 200) {
               // console.log('Login successful:', response.data);
               // console.log("Full response data:", response.data);  // Check the full response object
    
                // Ensure the token exists before storing it
                if (response.data.token) {
                    localStorage.setItem("token", response.data.token);
                   // console.log("Token stored in localStorage:", localStorage.getItem("token"));
                } else {
                    console.warn("Token not found in response data");
                }
    
                setMessage('Login successful!');
                navigate('/vehicles');  // Redirect only once on successful login
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
    
            // Handle 401 unauthorized error for wrong credentials
            if (error.response?.status === 401) {
                setMessage('Invalid credentials, please try again.');
            } else {
                setMessage('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="compdiv">
            <h2>Login</h2>
            <p>(Login to Book Vehicles)</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Display message */}
            {message && <p>{message}</p>}

            {/* Register and Forgot Password links */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
            </div>
        </div>
    );
};

export default Login;
