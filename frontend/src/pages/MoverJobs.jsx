import MoverSidebar from '../components/MoverSidebar';
import { Filter, Search } from 'lucide-react';
import '../styles/MoverJobs.css';

const MoverJobs = () => {
  return (
    <div className="dashboard-layout">
      <MoverSidebar />
      <main className="mover-jobs-main">
        <div className="page-header">
          <h1>My Jobs</h1>
          <div className="header-actions">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="Search bookings..." />
            </div>
            <button className="filter-btn">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        <div className="jobs-tabs">
          <button className="tab active">All Jobs</button>
          <button className="tab">Upcoming</button>
          <button className="tab">In Progress</button>
          <button className="tab">Completed</button>
          <button className="tab">Cancelled</button>
        </div>

        <div className="jobs-grid">
          <div className="job-card confirmed">
            <div className="job-status-badge">Confirmed</div>
            <div className="job-info">
              <h3>Move for John Doe</h3>
              <p className="booking-ref">Booking #BK-2026-001</p>
              <div className="job-meta">
                <div className="meta-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">Feb 15, 2026 - 9:00 AM</span>
                </div>
                <div className="meta-item">
                  <span className="label">From:</span>
                  <span className="value">123 Main Street, Nairobi</span>
                </div>
                <div className="meta-item">
                  <span className="label">To:</span>
                  <span className="value">456 Oak Avenue, Westlands</span>
                </div>
                <div className="meta-item">
                  <span className="label">Distance:</span>
                  <span className="value">12.5 km</span>
                </div>
                <div className="meta-item">
                  <span className="label">Items:</span>
                  <span className="value">18 items (9m³)</span>
                </div>
                <div className="meta-item">
                  <span className="label">Payment:</span>
                  <span className="value">KES 15,000</span>
                </div>
              </div>
              <div className="job-actions">
                <button className="btn-outline">Contact Client</button>
                <button className="btn-primary">View Details</button>
              </div>
            </div>
          </div>

          <div className="job-card in-progress">
            <div className="job-status-badge">In Progress</div>
            <div className="job-info">
              <h3>Move for Jane Smith</h3>
              <p className="booking-ref">Booking #BK-2026-002</p>
              <div className="job-meta">
                <div className="meta-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">Feb 3, 2026 - 10:00 AM</span>
                </div>
                <div className="meta-item">
                  <span className="label">From:</span>
                  <span className="value">789 Park Road, Kilimani</span>
                </div>
                <div className="meta-item">
                  <span className="label">To:</span>
                  <span className="value">321 Valley Drive, Karen</span>
                </div>
                <div className="meta-item">
                  <span className="label">Distance:</span>
                  <span className="value">8.2 km</span>
                </div>
                <div className="meta-item">
                  <span className="label">Items:</span>
                  <span className="value">24 items (12m³)</span>
                </div>
                <div className="meta-item">
                  <span className="label">Payment:</span>
                  <span className="value">KES 18,500</span>
                </div>
              </div>
              <div className="job-actions">
                <button className="btn-outline">Message Client</button>
                <button className="btn-success">Mark Complete</button>
              </div>
            </div>
          </div>

          <div className="job-card completed">
            <div className="job-status-badge">Completed</div>
            <div className="job-info">
              <h3>Move for Michael Brown</h3>
              <p className="booking-ref">Booking #BK-2026-000</p>
              <div className="job-meta">
                <div className="meta-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">Jan 28, 2026 - 2:00 PM</span>
                </div>
                <div className="meta-item">
                  <span className="label">From:</span>
                  <span className="value">111 First Ave, CBD</span>
                </div>
                <div className="meta-item">
                  <span className="label">To:</span>
                  <span className="value">222 Second St, Parklands</span>
                </div>
                <div className="meta-item">
                  <span className="label">Distance:</span>
                  <span className="value">6.8 km</span>
                </div>
                <div className="meta-item">
                  <span className="label">Items:</span>
                  <span className="value">15 items (7.5m³)</span>
                </div>
                <div className="meta-item">
                  <span className="label">Payment:</span>
                  <span className="value">KES 13,500</span>
                </div>
              </div>
              <div className="job-actions">
                <button className="btn-outline">View Receipt</button>
                <button className="btn-outline">View Review</button>
              </div>
            </div>
          </div>

          <div className="job-card confirmed">
            <div className="job-status-badge">Confirmed</div>
            <div className="job-info">
              <h3>Move for Alice Johnson</h3>
              <p className="booking-ref">Booking #BK-2026-003</p>
              <div className="job-meta">
                <div className="meta-item">
                  <span className="label">Date & Time:</span>
                  <span className="value">Feb 18, 2026 - 2:00 PM</span>
                </div>
                <div className="meta-item">
                  <span className="label">From:</span>
                  <span className="value">555 Hill Street, Lavington</span>
                </div>
                <div className="meta-item">
                  <span className="label">To:</span>
                  <span className="value">777 Beach Road, Nyali</span>
                </div>
                <div className="meta-item">
                  <span className="label">Distance:</span>
                  <span className="value">485 km</span>
                </div>
                <div className="meta-item">
                  <span className="label">Items:</span>
                  <span className="value">35 items (18m³)</span>
                </div>
                <div className="meta-item">
                  <span className="label">Payment:</span>
                  <span className="value">KES 95,000</span>
                </div>
              </div>
              <div className="job-actions">
                <button className="btn-outline">Contact Client</button>
                <button className="btn-primary">View Details</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoverJobs;
