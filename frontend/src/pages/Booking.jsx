import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Star, MapPin, Calendar } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import '../styles/Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMover, setSelectedMover] = useState(null);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const data = await bookingService.getMovers();
        setMovers(data.movers || []);
      } catch (err) {
        console.error('Failed to fetch movers:', err);
        setError('Failed to load movers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, []);

  const handleSelectMover = (mover) => {
    setSelectedMover(mover);
    // Store selected mover in sessionStorage for confirm page
    sessionStorage.setItem('selectedMover', JSON.stringify(mover));
    navigate('/confirm-booking');
  };

  // Mock data for fallback if API fails
  const mockMovers = [
    {
      id: 1,
      company_name: 'Swift Movers Ltd',
      rating: 4.8,
      total_jobs_completed: 124,
      estimated_time: '4-5 hours',
      base_price_per_km: 500,
    },
    {
      id: 2,
      company_name: 'Premium Relocations',
      rating: 4.9,
      total_jobs_completed: 89,
      estimated_time: '3-4 hours',
      base_price_per_km: 600,
    },
    {
      id: 3,
      company_name: 'Easy Move Services',
      rating: 4.6,
      total_jobs_completed: 156,
      estimated_time: '5-6 hours',
      base_price_per_km: 450,
    },
    {
      id: 4,
      company_name: 'City Movers Pro',
      rating: 4.7,
      total_jobs_completed: 203,
      estimated_time: '4-5 hours',
      base_price_per_km: 550,
    },
  ];

  const displayMovers = movers.length > 0 ? movers : mockMovers;

  // Calculate mock price
  const calculatePrice = (mover) => {
    const distanceKm = 12.5; // Mock distance
    const volume = 9; // Mock volume
    const basePrice = distanceKm * (mover.base_price_per_km || 500);
    const laborCost = 2000;
    const packingCost = volume * 100;
    return (basePrice + laborCost + packingCost).toLocaleString();
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="booking-main">
        <h1>Select Your Mover</h1>

        {loading && <div className="loading">Loading movers...</div>}
        
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="booking-content">
            <div className="movers-list">
              {displayMovers.map((mover, index) => (
                <div key={mover.id || index} className="mover-card">
                  <div className="mover-info">
                    <h3>{mover.company_name}</h3>
                    <div className="mover-rating">
                      <Star size={16} fill="#FFC107" color="#FFC107" />
                      <span>{mover.rating}</span>
                      <span className="reviews">
                        ({mover.total_jobs_completed || 0} jobs)
                      </span>
                    </div>
                    <p className="estimated-time">
                      Estimated time: {mover.estimated_time || '4-5 hours'}
                    </p>
                  </div>
                  <div className="mover-pricing">
                    <p className="price-label">Estimated Price</p>
                    <p className="price">KES {calculatePrice(mover)}</p>
                    <button 
                      className="select-mover-btn"
                      onClick={() => handleSelectMover(mover)}
                    >
                      Select Mover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="move-summary-sidebar">
              <div className="summary-card">
                <h3>Move Summary</h3>
                <div className="summary-item">
                  <MapPin size={16} />
                  <div>
                    <p className="label">From</p>
                    <p className="value">123 Main Street, Nairobi</p>
                  </div>
                </div>
                <div className="summary-item">
                  <MapPin size={16} />
                  <div>
                    <p className="label">To</p>
                    <p className="value">456 Oak Avenue, Westlands</p>
                  </div>
                </div>
                <div className="summary-item">
                  <Calendar size={16} />
                  <div>
                    <p className="label">Move Date</p>
                    <p className="value">February 15, 2026</p>
                  </div>
                </div>
                <div className="summary-total">
                  <p className="label">Total Items:</p>
                  <p className="value">18</p>
                </div>
                <div className="summary-total">
                  <p className="label">Estimated Volume:</p>
                  <p className="value">9m³</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Booking;

