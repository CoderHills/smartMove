import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Package, Calendar } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import { clientService } from '../services/clientService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await clientService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleTrackMove = () => {
    navigate('/tracking');
  };

  const handleNewMove = () => {
    navigate('/inventory');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div className="loading">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <h1>Welcome back, {user?.full_name || 'User'}!</h1>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="status-cards">
          {dashboardData?.current_move ? (
            <>
              <div className="status-card">
                <div className="status-icon blue">
                  <Package size={24} />
                </div>
                <div className="status-info">
                  <p className="status-label">Current Move Status</p>
                  <p className="status-value">{dashboardData.current_move.status}</p>
                </div>
              </div>

              <div className="status-card">
                <div className="status-icon green">
                  <Calendar size={24} />
                </div>
                <div className="status-info">
                  <p className="status-label">Upcoming Move Date</p>
                  <p className="status-value">
                    {dashboardData.upcoming_move?.date || 'Not scheduled'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="status-card">
              <div className="status-icon blue">
                <Package size={24} />
              </div>
              <div className="status-info">
                <p className="status-label">No Active Moves</p>
                <p className="status-value">Start a new move!</p>
              </div>
            </div>
          )}
        </div>

        {dashboardData?.current_move && (
          <div className="move-details-card">
            <h2>Current Move Details</h2>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <p className="detail-label">Pickup Location</p>
                <p className="detail-value">{dashboardData.current_move.pickup_location}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <p className="detail-label">Drop-off Location</p>
                <p className="detail-value">{dashboardData.current_move.dropoff_location}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🕐</span>
              <div>
                <p className="detail-label">Estimated Completion</p>
                <p className="detail-value">{dashboardData.current_move.estimated_completion}</p>
              </div>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={handleTrackMove}>
              Track Current Move
            </button>
            <button className="action-btn" onClick={handleNewMove}>
              Start New Move
            </button>
            <button className="action-btn">
              View Move History
            </button>
          </div>
        </div>

        <div className="stats-summary">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{dashboardData?.stats?.completed_moves || 0}</span>
              <span className="stat-label">Completed Moves</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{dashboardData?.stats?.total_bookings || 0}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

