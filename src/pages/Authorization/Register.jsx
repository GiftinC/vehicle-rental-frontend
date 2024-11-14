import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/register` , { email, password });
            setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000); // 3-second delay before redirecting to login
        } catch (error) {
            setMessage('Error registering user: ' + error.message);
        }
    };

    return (
        <div className="compdiv">
                 <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/forgot-password')}>Forgot Password</button>
            </div>
        </div>
    );
};

export default Register;
