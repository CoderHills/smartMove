import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { TrendingUp, Users, DollarSign, Package, Calendar, Star, MapPin, Truck } from 'lucide-react';
import '../styles/AdminAnalytics.css';

const AdminAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock analytics data
  const analytics = {
    overview: {
      totalRevenue: 2450000,
      revenueGrowth: 22,
      totalBookings: 3542,
      bookingsGrowth: 18,
      activeUsers: 1247,
      usersGrowth: 12,
      avgRating: 4.7,
      ratingChange: 0.3
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 180000, bookings: 245 },
      { month: 'Feb', revenue: 220000, bookings: 312 },
      { month: 'Mar', revenue: 195000, bookings: 278 },
      { month: 'Apr', revenue: 240000, bookings: 335 },
      { month: 'May', revenue: 280000, bookings: 389 },
      { month: 'Jun', revenue: 310000, bookings: 421 },
      { month: 'Jul', revenue: 290000, bookings: 398 },
      { month: 'Aug', revenue: 265000, bookings: 367 },
      { month: 'Sep', revenue: 235000, bookings: 324 },
      { month: 'Oct', revenue: 255000, bookings: 351 },
      { month: 'Nov', revenue: 270000, bookings: 378 },
      { month: 'Dec', revenue: 310000, bookings: 444 }
    ],
    topMovers: [
      { name: 'Swift Movers Ltd', jobs: 124, revenue: 580000, rating: 4.8 },
      { name: 'Premium Relocations', jobs: 89, revenue: 485000, rating: 4.9 },
      { name: 'Easy Move Services', jobs: 156, revenue: 420000, rating: 4.6 },
      { name: 'City Movers Pro', jobs: 203, revenue: 615000, rating: 4.7 }
    ],
    topLocations: [
      { location: 'Nairobi', bookings: 1245, percentage: 35 },
      { location: 'Mombasa', bookings: 567, percentage: 16 },
      { location: 'Kisumu', bookings: 423, percentage: 12 },
      { location: 'Nakuru', bookings: 389, percentage: 11 },
      { location: 'Eldoret', bookings: 312, percentage: 9 },
      { location: 'Others', bookings: 606, percentage: 17 }
    ],
    bookingStatus: [
      { status: 'Completed', count: 2145, percentage: 60.5 },
      { status: 'In Progress', count: 456, percentage: 12.9 },
      { status: 'Confirmed', count: 678, percentage: 19.1 },
      { status: 'Cancelled', count: 263, percentage: 7.5 }
    ],
    customerMetrics: {
      newCustomers: 156,
      returningCustomers: 89,
      averageBookingValue: 18500,
      customerSatisfaction: 94
    }
  };

  const formatCurrency = (amount) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getGrowthClass = (growth) => {
    return growth >= 0 ? 'growth-positive' : 'growth-negative';
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1>Analytics & Insights</h1>
            <p>Comprehensive platform performance metrics</p>
          </div>
          <div className="period-selector">
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button 
              className={selectedPeriod === 'year' ? 'active' : ''}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Overview KPIs */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon revenue">
                <DollarSign size={24} />
              </div>
              <span className={`kpi-change ${getGrowthClass(analytics.overview.revenueGrowth)}`}>
                <TrendingUp size={14} />
                +{analytics.overview.revenueGrowth}%
              </span>
            </div>
            <h3 className="kpi-value">{formatCurrency(analytics.overview.totalRevenue)}</h3>
            <p className="kpi-label">Total Revenue</p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon bookings">
                <Package size={24} />
              </div>
              <span className={`kpi-change ${getGrowthClass(analytics.overview.bookingsGrowth)}`}>
                <TrendingUp size={14} />
                +{analytics.overview.bookingsGrowth}%
              </span>
            </div>
            <h3 className="kpi-value">{analytics.overview.totalBookings.toLocaleString()}</h3>
            <p className="kpi-label">Total Bookings</p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon users">
                <Users size={24} />
              </div>
              <span className={`kpi-change ${getGrowthClass(analytics.overview.usersGrowth)}`}>
                <TrendingUp size={14} />
                +{analytics.overview.usersGrowth}%
              </span>
            </div>
            <h3 className="kpi-value">{analytics.overview.activeUsers.toLocaleString()}</h3>
            <p className="kpi-label">Active Users</p>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-icon rating">
                <Star size={24} />
              </div>
              <span className={`kpi-change ${getGrowthClass(analytics.overview.ratingChange)}`}>
                <TrendingUp size={14} />
                +{analytics.overview.ratingChange}
              </span>
            </div>
            <h3 className="kpi-value">{analytics.overview.avgRating} ⭐</h3>
            <p className="kpi-label">Average Rating</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="chart-card">
          <h3>Revenue & Bookings Trend</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {analytics.revenueByMonth.map((data, index) => {
                const maxRevenue = Math.max(...analytics.revenueByMonth.map(d => d.revenue));
                const height = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={index} className="bar-group">
                    <div className="bar-container">
                      <div 
                        className="bar revenue-bar" 
                        style={{ height: `${height}%` }}
                        title={`${data.month}: ${formatCurrency(data.revenue)}`}
                      >
                        <span className="bar-value">{(data.revenue / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="analytics-grid">
          {/* Top Movers */}
          <div className="analytics-card">
            <h3>
              <Truck size={20} />
              Top Performing Movers
            </h3>
            <div className="movers-list">
              {analytics.topMovers.map((mover, index) => (
                <div key={index} className="mover-item">
                  <div className="mover-rank">#{index + 1}</div>
                  <div className="mover-details">
                    <p className="mover-name">{mover.name}</p>
                    <div className="mover-stats">
                      <span>{mover.jobs} jobs</span>
                      <span>•</span>
                      <span>{mover.rating} ⭐</span>
                      <span>•</span>
                      <span>{formatCurrency(mover.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="analytics-card">
            <h3>
              <MapPin size={20} />
              Popular Locations
            </h3>
            <div className="locations-list">
              {analytics.topLocations.map((loc, index) => (
                <div key={index} className="location-item">
                  <div className="location-info">
                    <span className="location-name">{loc.location}</span>
                    <span className="location-count">{loc.bookings} bookings</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${loc.percentage}%` }}
                    ></div>
                  </div>
                  <span className="location-percentage">{loc.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Status & Customer Metrics */}
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>
              <Package size={20} />
              Booking Status Distribution
            </h3>
            <div className="status-list">
              {analytics.bookingStatus.map((status, index) => (
                <div key={index} className="status-item">
                  <div className="status-header">
                    <span className="status-name">{status.status}</span>
                    <span className="status-count">{status.count}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill status-${status.status.toLowerCase().replace(' ', '-')}`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="status-percentage">{status.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>
              <Users size={20} />
              Customer Metrics
            </h3>
            <div className="metrics-grid">
              <div className="metric-box">
                <p className="metric-value">{analytics.customerMetrics.newCustomers}</p>
                <p className="metric-label">New Customers</p>
              </div>
              <div className="metric-box">
                <p className="metric-value">{analytics.customerMetrics.returningCustomers}</p>
                <p className="metric-label">Returning</p>
              </div>
              <div className="metric-box">
                <p className="metric-value">{formatCurrency(analytics.customerMetrics.averageBookingValue)}</p>
                <p className="metric-label">Avg Booking Value</p>
              </div>
              <div className="metric-box">
                <p className="metric-value">{analytics.customerMetrics.customerSatisfaction}%</p>
                <p className="metric-label">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;