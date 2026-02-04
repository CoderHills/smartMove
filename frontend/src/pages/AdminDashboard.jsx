import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Users, Truck, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingMovers, setPendingMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardResult, moversResult] = await Promise.all([
          adminService.getDashboard(),
          adminService.getPendingMovers()
        ]);
        setDashboardData(dashboardResult);
        setPendingMovers(moversResult.movers || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setError('Failed to load dashboard data');
        // Mock data for demo
        setDashboardData({
          stats: {
            total_users: 1247,
            active_movers: 89,
            total_bookings: 3542,
            revenue_this_month: 2400000,
            growth: {
              users: '+12%',
              movers: '+5',
              bookings: '+18%',
              revenue: '+22%'
            }
          },
          recent_bookings: [
            { booking_id: 'BK-2026-015', client: 'John Doe', mover: 'Swift Movers Ltd', date: 'Feb 15, 2026', amount: 15000, status: 'confirmed' },
            { booking_id: 'BK-2026-014', client: 'Jane Smith', mover: 'Quick Move Pro', date: 'Feb 10, 2026', amount: 18500, status: 'in_progress' },
            { booking_id: 'BK-2026-013', client: 'Mike Johnson', mover: 'Easy Relocate', date: 'Feb 8, 2026', amount: 22000, status: 'completed' }
          ],
          quick_stats: {
            active_bookings_today: 15,
            new_users_today: 8,
            completion_rate: 94,
            average_rating: 4.7
          },
          top_movers: [
            { name: 'Swift Movers Ltd', jobs: 124, rating: 4.8 },
            { name: 'Premium Relocations', jobs: 89, rating: 4.9 },
            { name: 'Easy Move Services', jobs: 156, rating: 4.6 }
          ]
        });
        setPendingMovers([
          { id: 1, company_name: 'Express Movers Ltd', email: 'express@movers.co.ke', created_at: '2026-02-01', coverage_zones: ['Nairobi', 'Kiambu'] },
          { id: 2, company_name: 'Reliable Logistics', email: 'info@reliable.co.ke', created_at: '2026-02-02', coverage_zones: ['Mombasa', 'Kilifi'] },
          { id: 3, company_name: 'SwiftShift Services', email: 'contact@swiftshift.ke', created_at: '2026-02-03', coverage_zones: ['Nakuru', 'Naivasha'] }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleApproveMover = async (moverId) => {
    try {
      await adminService.approveMover(moverId);
      setPendingMovers(prev => prev.filter(m => m.id !== moverId));
    } catch (err) {
      console.error('Failed to approve mover:', err);
    }
  };

  const handleRejectMover = async (moverId) => {
    try {
      await adminService.rejectMover(moverId);
      setPendingMovers(prev => prev.filter(m => m.id !== moverId));
    } catch (err) {
      console.error('Failed to reject mover:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <AdminSidebar />
        <main className="admin-dashboard-main">
          <div className="loading">Loading dashboard...</div>
        </main>
      </div>
    );
  }

  const data = dashboardData || {
    stats: {
      total_users: 0,
      active_movers: 0,
      total_bookings: 0,
      revenue_this_month: 0,
      growth: {}
    },
    recent_bookings: [],
    quick_stats: {},
    top_movers: []
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="admin-dashboard-main">
        <h1>Admin Dashboard</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{data.stats.total_users}</p>
              <p className="stat-change positive">{data.stats.growth?.users || '+0%'} from last month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Truck size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Active Movers</p>
              <p className="stat-value">{data.stats.active_movers}</p>
              <p className="stat-change positive">{data.stats.growth?.movers || '+0'} new this week</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">{data.stats.total_bookings}</p>
              <p className="stat-change positive">{data.stats.growth?.bookings || '+0%'} from last month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Revenue (This Month)</p>
              <p className="stat-value">KES {(data.stats.revenue_this_month / 1000000).toFixed(1)}M</p>
              <p className="stat-change positive">{data.stats.growth?.revenue || '+0%'} from last month</p>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="main-section">
            <div className="card">
              <div className="card-header">
                <h2>Pending Mover Approvals</h2>
                <span className="badge">{pendingMovers.length} Pending</span>
              </div>
              {pendingMovers.length === 0 ? (
                <p className="no-data">No pending mover approvals</p>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Registration No.</th>
                        <th>Applied On</th>
                        <th>Coverage Zone</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMovers.map((mover) => (
                        <tr key={mover.id}>
                          <td>
                            <div className="company-info">
                              <strong>{mover.company_name}</strong>
                              <span className="email">{mover.email}</span>
                            </div>
                          </td>
                          <td>REG-2026-{String(mover.id).padStart(3, '0')}</td>
                          <td>{mover.created_at || 'N/A'}</td>
                          <td>{mover.coverage_zones?.join(', ') || 'Not specified'}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-success-sm"
                                onClick={() => handleApproveMover(mover.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn-danger-sm"
                                onClick={() => handleRejectMover(mover.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Recent Bookings</h2>
                <a href="/admin/bookings" className="view-all">View All</a>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Client</th>
                      <th>Mover</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_bookings.map((booking, index) => (
                      <tr key={index}>
                        <td>#{booking.booking_id}</td>
                        <td>{booking.client}</td>
                        <td>{booking.mover}</td>
                        <td>{booking.date}</td>
                        <td>KES {booking.amount?.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="card">
              <h3>Platform Health</h3>
              <div className="health-metrics">
                <div className="metric-item">
                  <div className="metric-icon success">
                    <TrendingUp size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-label">System Status</span>
                    <span className="metric-value">Operational</span>
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-icon warning">
                    <AlertCircle size={20} />
                  </div>
                  <div className="metric-info">
                    <span className="metric-label">Pending Reviews</span>
                    <span className="metric-value">{data.quick_stats?.pending_reviews || 12}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Quick Stats</h3>
              <div className="quick-stats">
                <div className="stat-item">
                  <span>Active Bookings Today</span>
                  <strong>{data.quick_stats?.active_bookings_today || 0}</strong>
                </div>
                <div className="stat-item">
                  <span>New Users Today</span>
                  <strong>{data.quick_stats?.new_users_today || 0}</strong>
                </div>
                <div className="stat-item">
                  <span>Completion Rate</span>
                  <strong>{data.quick_stats?.completion_rate || 0}%</strong>
                </div>
                <div className="stat-item">
                  <span>Avg. Rating</span>
                  <strong>{data.quick_stats?.average_rating || 0}/5</strong>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Top Movers</h3>
              <div className="top-movers">
                {(data.top_movers || []).map((mover, index) => (
                  <div key={index} className="mover-item">
                    <span className="rank">{index + 1}</span>
                    <div className="mover-info">
                      <strong>{mover.name}</strong>
                      <span>{mover.jobs} jobs • {mover.rating}⭐</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

