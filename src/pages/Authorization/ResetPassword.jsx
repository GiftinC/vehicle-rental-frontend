import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../apis/api.js';

const ResetPassword = () => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // Extract token from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const tokenFromUrl = query.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/reset-password', { token, newPassword });
      setMessage('Password reset successful!');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000); // 3-second delay before redirecting to login
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || 'Error resetting password'));
      setLoading(false);
    }
  };

  return (
    <div className="compdiv">
      <h2>Enter New Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Setting New Password...' : 'Set New Password'}
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* Login button, shown after success */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/login')} disabled={loading}>
          Redirect page to Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
