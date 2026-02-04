import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Truck, MapPin, LogOut, Package } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { removeAuthToken } from '../services/api';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inventory', icon: List, label: 'Inventory' },
    { path: '/booking', icon: Truck, label: 'Booking' },
    { path: '/tracking', icon: MapPin, label: 'Tracking' },
  ];

  const handleLogout = () => {
    removeAuthToken();
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Package className="logo-icon" />
        <div className="logo-text">
          <h1>SmartMove</h1>
          <p>Client Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;

