import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, MessageSquare, Star, Settings, LogOut, Package } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { removeAuthToken } from '../services/api';
import '../styles/Sidebar.css';

const MoverSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { path: '/mover/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mover/jobs', icon: Briefcase, label: 'My Jobs' },
    { path: '/mover/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/mover/reviews', icon: Star, label: 'Reviews' },
    { path: '/mover/profile', icon: Settings, label: 'Profile' },
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
          <p>Mover Portal</p>
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

export default MoverSidebar;

