import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { CheckCircle, Clock, Circle, Phone, MessageCircle } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import '../styles/Tracking.css';

const Tracking = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    // Get booking ID from session or use default
    const booking = JSON.parse(sessionStorage.getItem('currentBooking') || '{}');
    const id = booking.id || 1;
    setBookingId(id);

    const fetchTracking = async () => {
      try {
        const data = await bookingService.getTrackingInfo(id);
        setTrackingData(data);
      } catch (err) {
        console.error('Failed to fetch tracking:', err);
        // Use mock data on error
        setTrackingData({
          status: 'in_progress',
          current_location: 'Mombasa Road, Nairobi',
          estimated_arrival: '2:00 PM',
          distance_remaining: 8.5,
          mover: {
            name: 'Swift Movers Ltd',
            team_lead: 'John Kamau',
            phone: '+254 700 123 456'
          },
          vehicle: {
            type: 'Truck (5 ton)',
            plate_number: 'KBZ 123X',
            crew_members: 3
          },
          status_updates: [
            {
              status: 'Booking Confirmed',
              timestamp: 'Feb 10, 2026 - 10:30 AM',
              completed: true
            },
            {
              status: 'Movers Arrived at Pickup',
              timestamp: 'Feb 15, 2026 - 9:00 AM',
              completed: true
            },
            {
              status: 'In Progress - Loading Complete',
              timestamp: 'Feb 15, 2026 - 11:45 AM',
              completed: true,
              active: true
            },
            {
              status: 'Arrival at Destination',
              timestamp: 'Estimated 2:00 PM',
              completed: false
            },
            {
              status: 'Move Completed',
              timestamp: 'Pending',
              completed: false
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, []);

  const getStatusIcon = (completed, active) => {
    if (completed) return <CheckCircle size={20} />;
    if (active) return <Clock size={20} />;
    return <Circle size={20} />;
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="tracking-main">
          <div className="loading">Loading tracking information...</div>
        </main>
      </div>
    );
  }

  const displayData = trackingData || {
    status: 'in_progress',
    current_location: 'Mombasa Road, Nairobi',
    estimated_arrival: '2:00 PM',
    distance_remaining: 8.5,
    mover: {
      name: 'Swift Movers Ltd',
      team_lead: 'John Kamau',
      phone: '+254 700 123 456'
    },
    vehicle: {
      type: 'Truck (5 ton)',
      plate_number: 'KBZ 123X',
      crew_members: 3
    },
    status_updates: []
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="tracking-main">
        <h1>Live Move Tracking</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="tracking-content">
          <div className="map-section">
            <div className="map-placeholder">
              <div className="location-marker">
                <div className="marker-pin"></div>
              </div>
              <div className="current-location">
                <p className="location-label">Current Location</p>
                <p className="location-value">{displayData.current_location}</p>
              </div>
            </div>

            <div className="move-status-card">
              <h3>Move Status</h3>
              <div className="status-timeline">
                {(displayData.status_updates || []).map((item, index) => (
                  <div 
                    key={index} 
                    className={`status-item ${item.completed ? 'completed' : ''} ${item.active ? 'active' : ''}`}
                  >
                    <div className="status-icon">
                      {getStatusIcon(item.completed, item.active)}
                    </div>
                    <div className="status-content">
                      <p className="status-text">{item.status}</p>
                      <p className="status-time">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tracking-sidebar">
            <div className="info-card">
              <div className="info-badge">Status: {displayData.status.replace('_', ' ')}</div>
              <div className="info-row">
                <span>Estimated Arrival:</span>
                <strong>{displayData.estimated_arrival}</strong>
              </div>
              <div className="info-row">
                <span>Distance Remaining:</span>
                <strong>{displayData.distance_remaining} km</strong>
              </div>
            </div>

            <div className="mover-card">
              <h3>Mover Details</h3>
              <p className="mover-name">{displayData.mover.name}</p>
              <p className="team-lead">Team Lead: {displayData.mover.team_lead}</p>
              <div className="contact-buttons">
                <button className="contact-btn primary">
                  <Phone size={16} />
                  Call Mover
                </button>
                <button className="contact-btn">
                  <MessageCircle size={16} />
                  Message Mover
                </button>
              </div>
            </div>

            <div className="vehicle-card">
              <h3>Vehicle Information</h3>
              <div className="vehicle-info">
                <div className="vehicle-row">
                  <span>Vehicle Type:</span>
                  <strong>{displayData.vehicle.type}</strong>
                </div>
                <div className="vehicle-row">
                  <span>Plate Number:</span>
                  <strong>{displayData.vehicle.plate_number}</strong>
                </div>
                <div className="vehicle-row">
                  <span>Crew Members:</span>
                  <strong>{displayData.vehicle.crew_members}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracking;

