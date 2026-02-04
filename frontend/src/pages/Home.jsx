import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, Calendar } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    moveDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to login/register for now
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <Package className="logo-icon" />
            <span>SmartMove</span>
          </div>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="register-btn" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <h1>Move Smarter with SmartMove</h1>
          <p>Professional moving services at your fingertips</p>

          <div className="quote-form">
            <div className="form-row">
              <div className="form-group">
                <label>Pickup Location</label>
                <input
                  type="text"
                  placeholder="Enter pickup address"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Drop-off Location</label>
                <input
                  type="text"
                  placeholder="Enter drop-off address"
                  value={formData.dropoffLocation}
                  onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Move Date</label>
              <input
                type="date"
                value={formData.moveDate}
                onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
              />
            </div>
            <button className="estimate-btn" onClick={handleSubmit}>Get Estimate</button>
          </div>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-icon">
                <Package size={32} />
              </div>
              <h3>1. List Your Items</h3>
              <p>Create an inventory of items you want to move</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3>2. Choose a Mover</h3>
              <p>Compare quotes and select the best mover for your needs</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Calendar size={32} />
              </div>
              <h3>3. Track Your Move</h3>
              <p>Real-time tracking and updates on your move status</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2026 SmartMove. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
