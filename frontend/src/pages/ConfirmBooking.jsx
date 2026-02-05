import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Package, Calendar, MapPin, DollarSign, CheckCircle } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import '../styles/ConfirmBooking.css';

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load data from sessionStorage
    const inventoryData = sessionStorage.getItem('inventoryData');
    const moverData = sessionStorage.getItem('selectedMover');
    
    if (!inventoryData || !moverData) {
      // Redirect back if no data
      navigate('/inventory');
      return;
    }

    const parsedInventory = JSON.parse(inventoryData);
    const parsedMover = JSON.parse(moverData);
    
    setBookingData({
      inventory: parsedInventory,
      mover: parsedMover,
      pickup: sessionStorage.getItem('pickupLocation') || '123 Main Street, Nairobi',
      dropoff: sessionStorage.getItem('dropoffLocation') || '456 Oak Avenue, Westlands',
      date: sessionStorage.getItem('moveDate') || 'February 15, 2026',
      time: sessionStorage.getItem('moveTime') || '09:00'
    });
    
    setLoading(false);
  }, [navigate]);

  const calculateTotal = () => {
    if (!bookingData) return 0;
    
    const distanceKm = 12.5; // Mock distance
    const volume = bookingData.inventory.estimatedVolume || 9;
    const mover = bookingData.mover;
    
    const basePrice = distanceKm * (mover.base_price_per_km || 500);
    const laborCost = 2000;
    const packingCost = volume * 100;
    
    return basePrice + laborCost + packingCost;
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const data = {
        pickup_location: bookingData.pickup,
        dropoff_location: bookingData.dropoff,
        move_date: sessionStorage.getItem('moveDate'),
        move_time: sessionStorage.getItem('moveTime'),
        mover_id: bookingData.mover.id,
        inventory: bookingData.inventory.items,
        estimated_volume: bookingData.inventory.estimatedVolume,
        total_amount: calculateTotal()
      };

      await bookingService.createBooking(data);
      
      // Clear session storage
      sessionStorage.removeItem('inventoryData');
      sessionStorage.removeItem('selectedMover');
      sessionStorage.removeItem('pickupLocation');
      sessionStorage.removeItem('dropoffLocation');
      sessionStorage.removeItem('moveDate');
      sessionStorage.removeItem('moveTime');
      
      // Navigate to dashboard with success message
      navigate('/dashboard', { state: { bookingSuccess: true } });
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError(err.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/booking');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="confirm-booking-main">
          <div className="loading">Loading booking details...</div>
        </main>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="confirm-booking-main">
        <h1>Confirm Your Booking</h1>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="confirm-content">
          <div className="confirm-main">
            {/* Move Details */}
            <div className="confirm-card">
              <h2>Move Details</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <MapPin size={20} />
                  <div>
                    <p className="detail-label">Pickup Location</p>
                    <p className="detail-value">{bookingData.pickup}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={20} />
                  <div>
                    <p className="detail-label">Drop-off Location</p>
                    <p className="detail-value">{bookingData.dropoff}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={20} />
                  <div>
                    <p className="detail-label">Move Date</p>
                    <p className="detail-value">{bookingData.date}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={20} />
                  <div>
                    <p className="detail-label">Time</p>
                    <p className="detail-value">{bookingData.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Mover */}
            <div className="confirm-card">
              <h2>Selected Mover</h2>
              <div className="mover-summary">
                <h3>{bookingData.mover.company_name}</h3>
                <p className="mover-rating">⭐ {bookingData.mover.rating} ({bookingData.mover.total_jobs_completed} jobs)</p>
                <p className="mover-time">Estimated time: {bookingData.mover.estimated_time}</p>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="confirm-card">
              <h2>Inventory Summary</h2>
              <div className="inventory-summary">
                <div className="inventory-stats">
                  <div className="stat">
                    <Package size={20} />
                    <span>Room Type: <strong>{bookingData.inventory.roomType}</strong></span>
                  </div>
                  <div className="stat">
                    <Package size={20} />
                    <span>Total Items: <strong>{bookingData.inventory.totalItems}</strong></span>
                  </div>
                  <div className="stat">
                    <Package size={20} />
                    <span>Estimated Volume: <strong>{bookingData.inventory.estimatedVolume}m³</strong></span>
                  </div>
                </div>
                <button className="edit-btn" onClick={() => navigate('/inventory')}>
                  Edit Inventory
                </button>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="confirm-sidebar">
            <div className="price-card">
              <h3>Price Summary</h3>
              
              <div className="price-row">
                <span>Base Price ({12.5}km)</span>
                <span>KES {(12.5 * bookingData.mover.base_price_per_km).toLocaleString()}</span>
              </div>
              
              <div className="price-row">
                <span>Labor Cost</span>
                <span>KES 2,000</span>
              </div>
              
              <div className="price-row">
                <span>Packing ({bookingData.inventory.estimatedVolume}m³)</span>
                <span>KES {(bookingData.inventory.estimatedVolume * 100).toLocaleString()}</span>
              </div>
              
              <div className="price-divider"></div>
              
              <div className="price-total">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>

              <div className="price-note">
                <CheckCircle size={16} />
                <span>Free cancellation before 24 hours</span>
              </div>

              <div className="confirm-actions">
                <button className="back-btn" onClick={handleBack} disabled={submitting}>
                  Back
                </button>
                <button 
                  className="confirm-btn" 
                  onClick={handleConfirmBooking}
                  disabled={submitting}
                >
                  {submitting ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmBooking;
