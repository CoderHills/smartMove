import { useState, useEffect, useContext } from 'react';
import MoverSidebar from '../components/MoverSidebar';
import { Briefcase, DollarSign, Star, TrendingUp } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import { moverService } from '../services/moverService';
import '../styles/Dashboard.css';
import '../styles/MoverDashboard.css';

const MoverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardDataResult, jobsResult] = await Promise.all([
          moverService.getDashboard(),
          moverService.getJobs()
        ]);
        setDashboardData(dashboardDataResult);
        setJobs(jobsResult.jobs || []);
      } catch (err) {
        console.error('Failed to fetch mover data:', err);
        setError('Failed to load dashboard data');
        // Mock data for demo
        setDashboardData({
          active_jobs: 3,
          total_earnings: 125000,
          average_rating: 4.8,
          completed_jobs: 47
        });
        setJobs([
          {
            id: 1,
            booking_reference: 'BK-2026-001',
            client_name: 'John Doe',
            pickup_address: '123 Main Street, Nairobi',
            dropoff_address: '456 Oak Avenue, Westlands',
            scheduled_date: '2026-02-15',
            scheduled_time: '09:00',
            status: 'confirmed',
            total_price: 15000
          },
          {
            id: 2,
            booking_reference: 'BK-2026-002',
            client_name: 'Jane Smith',
            pickup_address: '789 Park Road, Kilimani',
            dropoff_address: '321 Valley Drive, Karen',
            scheduled_date: '2026-02-03',
            scheduled_time: '10:00',
            status: 'in_progress',
            total_price: 18500
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <MoverSidebar />
        <main className="dashboard-main">
          <div className="loading">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  const data = dashboardData || {
    active_jobs: 0,
    total_earnings: 0,
    average_rating: 0,
    completed_jobs: 0
  };

  return (
    <div className="dashboard-layout">
      <MoverSidebar />
      <main className="dashboard-main">
        <h1>Mover Dashboard</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Briefcase size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Active Jobs</p>
              <p className="stat-value">{data.active_jobs}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Earnings (This Month)</p>
              <p className="stat-value">KES {data.total_earnings?.toLocaleString() || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Star size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Average Rating</p>
              <p className="stat-value">{data.average_rating}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Completed Jobs</p>
              <p className="stat-value">{data.completed_jobs}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="main-content">
            <div className="card">
              <h2>Upcoming Jobs</h2>
              {jobs.length === 0 ? (
                <p className="no-data">No active jobs</p>
              ) : (
                <div className="jobs-list">
                  {jobs.map((job) => (
                    <div key={job.id} className="job-item">
                      <div className="job-header">
                        <div>
                          <h3>Move for {job.client_name}</h3>
                          <p className="job-ref">Booking #{job.booking_reference}</p>
                        </div>
                        <span className={`status-badge ${job.status}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="job-details">
                        <p><strong>Date:</strong> {job.scheduled_date} at {job.scheduled_time}</p>
                        <p><strong>From:</strong> {job.pickup_address}</p>
                        <p><strong>To:</strong> {job.dropoff_address}</p>
                        <p><strong>Payment:</strong> KES {job.total_price?.toLocaleString()}</p>
                      </div>
                      <div className="job-actions">
                        <button className="btn-secondary">Contact Client</button>
                        <button className="btn-primary">Update Status</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-content">
            <div className="card">
              <h3>Recent Reviews</h3>
              <div className="reviews-list">
                <div className="review-item">
                  <div className="review-header">
                    <div className="stars">⭐⭐⭐⭐⭐</div>
                    <span className="review-date">2 days ago</span>
                  </div>
                  <p className="review-text">"Excellent service! Very professional and careful with my items."</p>
                  <p className="review-author">- Sarah K.</p>
                </div>
                <div className="review-item">
                  <div className="review-header">
                    <div className="stars">⭐⭐⭐⭐</div>
                    <span className="review-date">1 week ago</span>
                  </div>
                  <p className="review-text">"Great team, arrived on time and finished quickly."</p>
                  <p className="review-author">- Mike T.</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Performance This Month</h3>
              <div className="performance-stats">
                <div className="perf-item">
                  <span>Jobs Completed:</span>
                  <strong>{data.completed_jobs}</strong>
                </div>
                <div className="perf-item">
                  <span>On-Time Rate:</span>
                  <strong>95%</strong>
                </div>
                <div className="perf-item">
                  <span>Customer Satisfaction:</span>
                  <strong>{data.average_rating}/5.0</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoverDashboard;

