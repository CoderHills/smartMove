import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Users, Mail, Phone, Calendar, Search, Filter, MoreVertical } from 'lucide-react';
import '../styles/AdminUsers.css';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock users data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254 700 123 456',
      role: 'client',
      status: 'active',
      joinedDate: '2024-01-15',
      totalBookings: 5,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254 700 234 567',
      role: 'client',
      status: 'active',
      joinedDate: '2024-02-20',
      totalBookings: 3,
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Swift Movers Ltd',
      email: 'contact@swiftmovers.co.ke',
      phone: '+254 700 345 678',
      role: 'mover',
      status: 'active',
      joinedDate: '2023-11-10',
      totalBookings: 124,
      lastActive: '5 mins ago'
    },
    {
      id: 4,
      name: 'Premium Relocations',
      email: 'info@premiumrelocations.co.ke',
      phone: '+254 700 456 789',
      role: 'mover',
      status: 'active',
      joinedDate: '2023-12-05',
      totalBookings: 89,
      lastActive: '1 hour ago'
    },
    {
      id: 5,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+254 700 567 890',
      role: 'client',
      status: 'inactive',
      joinedDate: '2024-01-30',
      totalBookings: 1,
      lastActive: '2 weeks ago'
    },
    {
      id: 6,
      name: 'Admin User',
      email: 'admin@smartmove.com',
      phone: '+254 700 000 000',
      role: 'admin',
      status: 'active',
      joinedDate: '2023-10-01',
      totalBookings: 0,
      lastActive: 'Online'
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'client': return 'role-client';
      case 'mover': return 'role-mover';
      case 'admin': return 'role-admin';
      default: return '';
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1>User Management</h1>
            <p>Manage all platform users</p>
          </div>
          <button className="primary-button">
            <Users size={20} />
            Add New User
          </button>
        </div>

        {/* Stats Overview */}
        <div className="users-stats">
          <div className="stat-box">
            <div className="stat-icon blue">
              <Users size={24} />
            </div>
            <div>
              <p className="stat-label">Total Users</p>
              <h3 className="stat-value">{users.length}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div>
              <p className="stat-label">Active Users</p>
              <h3 className="stat-value">{users.filter(u => u.status === 'active').length}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div>
              <p className="stat-label">Clients</p>
              <h3 className="stat-value">{users.filter(u => u.role === 'client').length}</h3>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon orange">
              <Users size={24} />
            </div>
            <div>
              <p className="stat-label">Movers</p>
              <h3 className="stat-value">{users.filter(u => u.role === 'mover').length}</h3>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <Filter size={18} />
            <button 
              className={filterRole === 'all' ? 'active' : ''}
              onClick={() => setFilterRole('all')}
            >
              All Users
            </button>
            <button 
              className={filterRole === 'client' ? 'active' : ''}
              onClick={() => setFilterRole('client')}
            >
              Clients
            </button>
            <button 
              className={filterRole === 'mover' ? 'active' : ''}
              onClick={() => setFilterRole('mover')}
            >
              Movers
            </button>
            <button 
              className={filterRole === 'admin' ? 'active' : ''}
              onClick={() => setFilterRole('admin')}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Bookings</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="user-name">{user.name}</p>
                        <p className="user-id">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{user.joinedDate}</span>
                    </div>
                  </td>
                  <td>
                    <span className="bookings-count">{user.totalBookings}</span>
                  </td>
                  <td>
                    <span className="last-active">{user.lastActive}</span>
                  </td>
                  <td>
                    <button className="action-menu-btn">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <Users size={64} />
              <p>No users found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
