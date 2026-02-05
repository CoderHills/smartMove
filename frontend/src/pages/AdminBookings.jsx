import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Package, Calendar, MapPin, DollarSign, Search, Filter, Eye } from 'lucide-react';
import '../styles/AdminBookings.css';

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      bookingRef: 'BK-2026-001',
      client: 'John Doe',
      clientEmail: 'john@example.com',
      mover: 'Swift Movers Ltd',
      pickup: '123 Main Street, Nairobi',
      dropoff: '456 Oak Avenue, Westlands',
      date: '2026-02-10',
      time: '09:00',
      distance: 12.5,
      volume: 9.5,
      amount: 15000,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2026-02-05'
    },
    {
      id: 2,
      bookingRef: 'BK-2026-002',
      client: 'Jane Smith',
      clientEmail: 'jane@example.com',
      mover: 'Premium Relocations',
      pickup: '789 Park Road, Kilimani',
      dropoff: '321 Valley Drive, Karen',
      date: '2026-02-08',
      time: '10:00',
      distance: 8.2,
      volume: 12.0,
      amount: 18500,
      status: 'in_progress',
      paymentStatus: 'paid',
      createdAt: '2026-02-03'
    },
    {
      id: 3,
      bookingRef: 'BK-2026-003',
      client: 'Michael Brown',
      clientEmail: 'michael@example.com',
      mover: 'Easy Move Services',
      pickup: '111 First Ave, CBD',
      dropoff: '222 Second St, Parklands',
      date: '2026-01-28',
      time: '14:00',
      distance: 6.8,
      volume: 7.5,
      amount: 13500,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2026-01-25'
    },
    {
      id: 4,
      bookingRef: 'BK-2026-004',
      client: 'Sarah Wilson',
      clientEmail: 'sarah@example.com',
      mover: 'Swift Movers Ltd',
      pickup: '555 Hill Street, Lavington',
      dropoff: '777 Beach Road, Nyali',
      date: '2026-02-15',
      time: '08:00',
      distance: 485.0,
      volume: 25.0,
      amount: 95000,
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: '2026-02-04'
    },
    {
      id: 5,
      bookingRef: 'BK-2026-005',
      client: 'Alice Johnson',
      clientEmail: 'alice@example.com',
      mover: 'Premium Relocations',
      pickup: '999 Sunset Blvd, Kileleshwa',
      dropoff: '888 Sunrise Lane, Runda',
      date: '2026-01-20',
      time: '11:00',
      distance: 15.3,
      volume: 10.0,
      amount: 16000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2026-01-18'
    },
    {
      id: 6,
      bookingRef: 'BK-2026-006',
      client: 'David Ochieng',
      clientEmail: 'david@example.com',
      mover: 'City Movers Pro',
      pickup: '333 Lake View, Kisumu',
      dropoff: '444 Garden Estate, Nairobi',
      date: '2026-02-12',
      time: '07:00',
      distance: 350.0,
      volume: 18.5,
      amount: 78000,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2026-02-05'
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.mover.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'in_progress')
    .reduce((sum, b) => sum + b.amount, 0);

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getPaymentClass = (status) => {
    switch(status) {
      case 'paid': return 'payment-paid';
      case 'pending': return 'payment-pending';
      case 'refunded': return 'payment-refunded';
      default: return '';
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1>Bookings Management</h1>
            <p>Monitor and manage all platform bookings</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bookings-stats">
          <div className="stat-box">
            <div className="stat-icon blue">
              <Package size={24} />
            </div>
            <div>
              <p className="stat-label">Total Bookings</p>
              <h3 className="stat-value">{totalBookings}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon green">
              <Calendar size={24} />
            </div>
            <div>
              <p className="stat-label">Confirmed</p>
              <h3 className="stat-value">{confirmedBookings}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon purple">
              <Package size={24} />
            </div>
            <div>
              <p className="stat-label">Completed</p>
              <h3 className="stat-value">{completedBookings}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon yellow">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">KES {totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by booking ID, client, or mover..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <Filter size={18} />
            <button 
              className={filterStatus === 'all' ? 'active' : ''}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button 
              className={filterStatus === 'pending' ? 'active' : ''}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
            <button 
              className={filterStatus === 'confirmed' ? 'active' : ''}
              onClick={() => setFilterStatus('confirmed')}
            >
              Confirmed
            </button>
            <button 
              className={filterStatus === 'in_progress' ? 'active' : ''}
              onClick={() => setFilterStatus('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={filterStatus === 'completed' ? 'active' : ''}
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </button>
            <button 
              className={filterStatus === 'cancelled' ? 'active' : ''}
              onClick={() => setFilterStatus('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-card">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client</th>
                <th>Mover</th>
                <th>Route</th>
                <th>Schedule</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <span className="booking-ref">{booking.bookingRef}</span>
                  </td>
                  <td>
                    <div className="client-info">
                      <p className="client-name">{booking.client}</p>
                      <p className="client-email">{booking.clientEmail}</p>
                    </div>
                  </td>
                  <td>
                    <span className="mover-name">{booking.mover}</span>
                  </td>
                  <td>
                    <div className="route-info">
                      <div className="route-item">
                        <MapPin size={14} />
                        <span className="route-text">{booking.pickup}</span>
                      </div>
                      <div className="route-item">
                        <MapPin size={14} />
                        <span className="route-text">{booking.dropoff}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="schedule-info">
                      <Calendar size={14} />
                      <div>
                        <p className="schedule-date">{booking.date}</p>
                        <p className="schedule-time">{booking.time}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="details-info">
                      <p>{booking.distance}km</p>
                      <p>{booking.volume}m³</p>
                    </div>
                  </td>
                  <td>
                    <span className="amount">KES {booking.amount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-badge ${getPaymentClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="empty-state">
              <Package size={64} />
              <p>No bookings found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminBookings;
