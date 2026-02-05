import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Truck, Star, MapPin, Package, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import '../styles/AdminMovers.css';

const AdminMovers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock movers data
  const movers = [
    {
      id: 1,
      companyName: 'Swift Movers Ltd',
      email: 'contact@swiftmovers.co.ke',
      phone: '+254 700 123 456',
      registrationNumber: 'REG-2024-001',
      vehicleType: 'Truck (5 ton)',
      capacity: 15,
      rating: 4.8,
      totalJobs: 124,
      completionRate: 98,
      status: 'approved',
      zones: ['Nairobi', 'Kiambu', 'Westlands'],
      basePrice: 100,
      pricePerM3: 500,
      joinedDate: '2023-11-10',
      reviewCount: 87
    },
    {
      id: 2,
      companyName: 'Premium Relocations',
      email: 'info@premiumrelocations.co.ke',
      phone: '+254 700 234 567',
      registrationNumber: 'REG-2024-002',
      vehicleType: 'Truck (7 ton)',
      capacity: 20,
      rating: 4.9,
      totalJobs: 89,
      completionRate: 99,
      status: 'approved',
      zones: ['Nairobi', 'Mombasa', 'Nakuru'],
      basePrice: 120,
      pricePerM3: 600,
      joinedDate: '2023-12-05',
      reviewCount: 65
    },
    {
      id: 3,
      companyName: 'Easy Move Services',
      email: 'hello@easymove.co.ke',
      phone: '+254 700 345 678',
      registrationNumber: 'REG-2024-003',
      vehicleType: 'Van (3 ton)',
      capacity: 10,
      rating: 4.6,
      totalJobs: 156,
      completionRate: 95,
      status: 'approved',
      zones: ['Nairobi', 'Kileleshwa', 'Parklands'],
      basePrice: 80,
      pricePerM3: 450,
      joinedDate: '2024-01-15',
      reviewCount: 112
    },
    {
      id: 4,
      companyName: 'Express Movers Ltd',
      email: 'express@movers.co.ke',
      phone: '+254 711 111 111',
      registrationNumber: 'REG-2024-004',
      vehicleType: 'Truck (6 ton)',
      capacity: 18,
      rating: 0,
      totalJobs: 0,
      completionRate: 0,
      status: 'pending',
      zones: ['Nairobi', 'Kiambu'],
      basePrice: 110,
      pricePerM3: 550,
      joinedDate: '2024-02-01',
      reviewCount: 0
    },
    {
      id: 5,
      companyName: 'Reliable Logistics',
      email: 'info@reliable.co.ke',
      phone: '+254 722 222 222',
      registrationNumber: 'REG-2024-005',
      vehicleType: 'Truck (5 ton)',
      capacity: 15,
      rating: 0,
      totalJobs: 0,
      completionRate: 0,
      status: 'pending',
      zones: ['Mombasa', 'Kilifi'],
      basePrice: 100,
      pricePerM3: 500,
      joinedDate: '2024-02-03',
      reviewCount: 0
    }
  ];

  const filteredMovers = movers.filter(mover => {
    const matchesSearch = 
      mover.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mover.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || mover.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const approvedMovers = movers.filter(m => m.status === 'approved').length;
  const pendingMovers = movers.filter(m => m.status === 'pending').length;
  const totalJobs = movers.reduce((sum, m) => sum + m.totalJobs, 0);
  const avgRating = (movers.filter(m => m.rating > 0).reduce((sum, m) => sum + m.rating, 0) / approvedMovers).toFixed(1);

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1>Movers Management</h1>
            <p>Manage all moving companies on the platform</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="movers-stats">
          <div className="stat-box">
            <div className="stat-icon green">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="stat-label">Approved Movers</p>
              <h3 className="stat-value">{approvedMovers}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon orange">
              <XCircle size={24} />
            </div>
            <div>
              <p className="stat-label">Pending Approval</p>
              <h3 className="stat-value">{pendingMovers}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon blue">
              <Package size={24} />
            </div>
            <div>
              <p className="stat-label">Total Jobs</p>
              <h3 className="stat-value">{totalJobs}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon yellow">
              <Star size={24} />
            </div>
            <div>
              <p className="stat-label">Average Rating</p>
              <h3 className="stat-value">{avgRating} ⭐</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search movers by company name or email..."
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
              All Movers
            </button>
            <button 
              className={filterStatus === 'approved' ? 'active' : ''}
              onClick={() => setFilterStatus('approved')}
            >
              Approved
            </button>
            <button 
              className={filterStatus === 'pending' ? 'active' : ''}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Movers Grid */}
        <div className="movers-grid">
          {filteredMovers.map((mover) => (
            <div key={mover.id} className={`mover-card ${mover.status}`}>
              <div className="mover-card-header">
                <div className="mover-icon">
                  <Truck size={32} />
                </div>
                <span className={`status-badge ${mover.status}`}>
                  {mover.status}
                </span>
              </div>

              <h3 className="mover-name">{mover.companyName}</h3>

              <div className="mover-details">
                <div className="detail-row">
                  <span className="label">Registration:</span>
                  <span className="value">{mover.registrationNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Vehicle:</span>
                  <span className="value">{mover.vehicleType}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Capacity:</span>
                  <span className="value">{mover.capacity}m³</span>
                </div>
                <div className="detail-row">
                  <span className="label">Base Price:</span>
                  <span className="value">KES {mover.basePrice}/km</span>
                </div>
              </div>

              <div className="zones-section">
                <MapPin size={16} />
                <div className="zones">
                  {mover.zones.map((zone, idx) => (
                    <span key={idx} className="zone-tag">{zone}</span>
                  ))}
                </div>
              </div>

              {mover.status === 'approved' && (
                <div className="performance-section">
                  <div className="perf-item">
                    <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{mover.rating} ({mover.reviewCount})</span>
                  </div>
                  <div className="perf-item">
                    <Package size={16} />
                    <span>{mover.totalJobs} jobs</span>
                  </div>
                  <div className="perf-item">
                    <CheckCircle size={16} />
                    <span>{mover.completionRate}% complete</span>
                  </div>
                </div>
              )}

              <div className="contact-section">
                <p>{mover.email}</p>
                <p>{mover.phone}</p>
              </div>

              <div className="mover-actions">
                {mover.status === 'pending' && (
                  <>
                    <button className="approve-btn">Approve</button>
                    <button className="reject-btn">Reject</button>
                  </>
                )}
                {mover.status === 'approved' && (
                  <>
                    <button className="view-btn">View Details</button>
                    <button className="suspend-btn">Suspend</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMovers.length === 0 && (
          <div className="empty-state">
            <Truck size={64} />
            <p>No movers found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMovers;