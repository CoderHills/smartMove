import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(formData.email, formData.password);
      
      // Redirect based on user role
      const role = data.user.role;
      if (role === 'client') {
        navigate('/dashboard');
      } else if (role === 'mover') {
        navigate('/mover/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Package className="logo-icon" />
          <h1>SmartMove</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="login-card">
          <h2>Login</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>

        <button className="back-link" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;

