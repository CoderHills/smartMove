import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Settings, Bell, Lock, Globe, Database, Mail, Shield, CreditCard } from 'lucide-react';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'SmartMove',
    platformEmail: 'admin@smartmove.com',
    supportEmail: 'support@smartmove.com',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    
    // Business Rules
    commissionRate: 10,
    cancellationWindow: 24,
    autoApproveMovers: false,
    minRating: 3.5,
    
    // Payment
    mpesaEnabled: true,
    cardPaymentEnabled: false,
    cashPaymentEnabled: true,
    
    // Features
    gpsTracking: true,
    chatSupport: true,
    reviewSystem: true,
    loyaltyProgram: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <main className="dashboard-main">
        <div className="page-header">
          <div>
            <h1>Platform Settings</h1>
            <p>Configure system-wide settings and preferences</p>
          </div>
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* General Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Globe size={20} />
            <h3>General Settings</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>Platform Email</label>
              <input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => handleChange('platformEmail', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
              />
            </div>
            <div className="setting-item">
              <label>Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Bell size={20} />
            <h3>Notifications</h3>
          </div>
          <div className="settings-list">
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Email Notifications</p>
                <p className="toggle-description">Send email alerts for important events</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">SMS Notifications</p>
                <p className="toggle-description">Send SMS alerts for critical updates</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Booking Alerts</p>
                <p className="toggle-description">Notify when new bookings are created</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.bookingAlerts}
                  onChange={(e) => handleChange('bookingAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Payment Alerts</p>
                <p className="toggle-description">Notify on payment transactions</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.paymentAlerts}
                  onChange={(e) => handleChange('paymentAlerts', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section">
          <div className="section-header">
            <Shield size={20} />
            <h3>Security</h3>
          </div>
          <div className="settings-grid">
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Two-Factor Authentication</p>
                <p className="toggle-description">Require 2FA for admin accounts</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <label>Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                min="15"
                max="180"
              />
            </div>
            <div className="setting-item">
              <label>Password Expiry (days)</label>
              <input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
                min="30"
                max="365"
              />
            </div>
          </div>
        </div>

        {/* Business Rules */}
        <div className="settings-section">
          <div className="section-header">
            <Database size={20} />
            <h3>Business Rules</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Platform Commission (%)</label>
              <input
                type="number"
                value={settings.commissionRate}
                onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div className="setting-item">
              <label>Cancellation Window (hours)</label>
              <input
                type="number"
                value={settings.cancellationWindow}
                onChange={(e) => handleChange('cancellationWindow', parseInt(e.target.value))}
                min="0"
                max="72"
              />
            </div>
            <div className="setting-item">
              <label>Minimum Rating</label>
              <input
                type="number"
                value={settings.minRating}
                onChange={(e) => handleChange('minRating', parseFloat(e.target.value))}
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Auto-Approve Movers</p>
                <p className="toggle-description">Automatically approve new mover registrations</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoApproveMovers}
                  onChange={(e) => handleChange('autoApproveMovers', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="settings-section">
          <div className="section-header">
            <CreditCard size={20} />
            <h3>Payment Methods</h3>
          </div>
          <div className="settings-list">
            <div className="toggle-item">
              <div>
                <p className="toggle-label">M-Pesa Payments</p>
                <p className="toggle-description">Enable M-Pesa mobile money payments</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.mpesaEnabled}
                  onChange={(e) => handleChange('mpesaEnabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Card Payments</p>
                <p className="toggle-description">Enable credit/debit card payments</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.cardPaymentEnabled}
                  onChange={(e) => handleChange('cardPaymentEnabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Cash Payments</p>
                <p className="toggle-description">Allow cash payment on delivery</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.cashPaymentEnabled}
                  onChange={(e) => handleChange('cashPaymentEnabled', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="settings-section">
          <div className="section-header">
            <Settings size={20} />
            <h3>Platform Features</h3>
          </div>
          <div className="settings-list">
            <div className="toggle-item">
              <div>
                <p className="toggle-label">GPS Tracking</p>
                <p className="toggle-description">Enable real-time GPS tracking for moves</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.gpsTracking}
                  onChange={(e) => handleChange('gpsTracking', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Live Chat Support</p>
                <p className="toggle-description">Enable in-app chat support</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.chatSupport}
                  onChange={(e) => handleChange('chatSupport', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Review System</p>
                <p className="toggle-description">Allow users to rate and review movers</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.reviewSystem}
                  onChange={(e) => handleChange('reviewSystem', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <p className="toggle-label">Loyalty Program</p>
                <p className="toggle-description">Reward frequent users with discounts</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.loyaltyProgram}
                  onChange={(e) => handleChange('loyaltyProgram', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <Lock size={20} />
            <h3>Danger Zone</h3>
          </div>
          <div className="danger-actions">
            <div className="danger-item">
              <div>
                <p className="danger-label">Clear All Cache</p>
                <p className="danger-description">Remove all cached data from the system</p>
              </div>
              <button className="danger-btn">Clear Cache</button>
            </div>
            <div className="danger-item">
              <div>
                <p className="danger-label">Reset Analytics</p>
                <p className="danger-description">Reset all analytics and metrics data</p>
              </div>
              <button className="danger-btn">Reset Analytics</button>
            </div>
            <div className="danger-item">
              <div>
                <p className="danger-label">Export Database</p>
                <p className="danger-description">Download a complete database backup</p>
              </div>
              <button className="warning-btn">Export Data</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;