import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'client',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    try {
      const data = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phone,
        role: formData.role,
      });
      
      // Redirect based on user role
      if (formData.role === 'client') {
        navigate('/dashboard');
      } else if (formData.role === 'mover') {
        navigate('/mover/dashboard');
      } else if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      // Show the actual error message from the backend
      let errorMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      
      // Provide more helpful error messages
      if (errorMsg.includes('Invalid email')) {
        errorMsg = 'Please enter a valid email address (e.g., name@domain.com)';
      } else if (errorMsg.includes('already registered')) {
        errorMsg = 'This email is already registered. Please login instead.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <Package className="logo-icon" />
          <h1>SmartMove</h1>
          <p>Create your account</p>
        </div>

        <div className="register-card">
          <h2>Sign Up</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                disabled={loading}
              />
            </div>
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
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Register As</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                disabled={loading}
              >
                <option value="client">Client (Looking to move)</option>
                <option value="mover">Mover (Moving company)</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            <button type="submit" className="register-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
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

export default Register;

