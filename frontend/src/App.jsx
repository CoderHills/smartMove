import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Booking from './pages/Booking';
import Tracking from './pages/Tracking';
import ConfirmBooking from './pages/ConfirmBooking';
import MoverDashboard from './pages/MoverDashboard';
import MoverJobs from './pages/MoverJobs';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminMovers from './pages/AdminMovers';
import AdminBookings from './pages/AdminBookings';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Client Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute allowedRoles={['client', 'mover']}>
                <Tracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirm-booking"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ConfirmBooking />
              </ProtectedRoute>
            }
          />
          
          {/* Mover Routes */}
          <Route
            path="/mover/dashboard"
            element={
              <ProtectedRoute allowedRoles={['mover']}>
                <MoverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mover/jobs"
            element={
              <ProtectedRoute allowedRoles={['mover']}>
                <MoverJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mover/messages"
            element={
              <ProtectedRoute allowedRoles={['mover']}>
                <MoverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mover/reviews"
            element={
              <ProtectedRoute allowedRoles={['mover']}>
                <MoverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mover/profile"
            element={
              <ProtectedRoute allowedRoles={['mover']}>
                <MoverDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/movers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMovers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

