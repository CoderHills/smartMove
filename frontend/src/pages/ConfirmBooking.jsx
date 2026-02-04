import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { CheckCircle, MapPin, Calendar, Star, ArrowLeft } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import '../styles/ConfirmBooking.css';

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const [selectedMover, setSelectedMover] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get stored data
    const mover = sessionStorage.getItem('selectedMover');
    const inventory = sessionStorage.getItem('inventoryData');

    if (mover) {
      setSelectedMover(JSON.parse(mover));
    }
    if (inventory) {
      setInventoryData(JSON.parse(inventory));
    }
  }, []);

  // Calculate total price
  const calculateTotal = () => {
    const distanceKm = 12.5; // Mock distance
    const volume = inventoryData?.estimatedVolume || 9;
    const basePrice = distanceKm * (selectedMover?.base_price_per_km || 500);
    const laborCost = 2000;
    const packingCost = volume * 100;
    return basePrice + laborCost + packingCost;
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create booking via API
      const bookingData = {
        moverId: selectedMover?.id,
        pickupAddress: '123 Main Street, Nairobi',
        pickupFloor: 'Ground Floor',
        pickupDetails: 'Building A',
        dropoffAddress: '456 Oak Avenue, Westlands',
        dropoffFloor: '2nd Floor',
        dropoffDetails: 'Apartment 204',
        scheduledDate: '2026-02-15',
        scheduledTime: '09:00',
        distanceKm: 12.5,
        totalVolume: inventoryData?.estimatedVolume || 9,
        specialInstructions: '',
      };

      const response = await bookingService.createBooking(bookingData);
      
      // Store booking for tracking
      sessionStorage.setItem('currentBooking', JSON.stringify(response.booking));
      
      // Navigate to tracking
      navigate('/tracking');
    } catch (err) {
      console.error('Failed to create booking:', err);
      // For demo, still navigate to tracking
      navigate('/tracking');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="confirm-booking-main">
        <h1>Confirm Your Booking</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="confirmation-alert">
          <CheckCircle size={20} />
          <span>
            You've selected {selectedMover?.company_name || 'Swift Movers Ltd'} for your move
          </span>
        </div>

        <div className="booking-sections">
          <div className="booking-section">
            <h2>Selected Mover</h2>
            <div className="mover-info-card">
              <div className="mover-header">
                <h3>{selectedMover?.company_name || 'Swift Movers Ltd'}</h3>
                <p className="total-price">
                  <span className="price-label">Total Price</span>
                  <span className="price-amount">KES {total.toLocaleString()}</span>
                </p>
              </div>
              <div className="mover-details">
                <div className="rating">
                  <Star size={16} fill="#FFC107" color="#FFC107" />
                  <span>{selectedMover?.rating || 4.8}</span>
                  <span className="reviews">
                    ({selectedMover?.total_jobs_completed || 124} reviews)
                  </span>
                </div>
                <p className="contact">Contact: +254 700 123 456</p>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Move Details</h2>
            <div className="details-card">
              <div className="detail-row">
                <MapPin size={20} />
                <div>
                  <p className="detail-label">Pickup Address</p>
                  <p className="detail-value">123 Main Street, Nairobi</p>
                  <p className="detail-extra">Ground Floor, Building A</p>
                </div>
              </div>
              <div className="detail-row">
                <MapPin size={20} />
                <div>
                  <p className="detail-label">Drop-off Address</p>
                  <p className="detail-value">456 Oak Avenue, Westlands</p>
                  <p className="detail-extra">2nd Floor, Apartment 204</p>
                </div>
              </div>
              <div className="detail-row">
                <Calendar size={20} />
                <div>
                  <p className="detail-label">Move Date & Time</p>
                  <p className="detail-value">February 15, 2026 at 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-section">
            <h2>Price Breakdown</h2>
            <div className="price-breakdown-card">
              <div className="price-row">
                <span>Base Moving Fee</span>
                <span>KES {(total - 3000).toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Labor (3 workers)</span>
                <span>KES 2,000</span>
              </div>
              <div className="price-row">
                <span>Packing Materials</span>
                <span>KES 1,000</span>
              </div>
              <div className="price-row subtotal">
                <span>Subtotal</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Service Fee</span>
                <span>KES 0</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
          <button className="back-btn" onClick={() => navigate('/booking')}>
            <ArrowLeft size={16} />
            Back to Movers
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConfirmBooking;

