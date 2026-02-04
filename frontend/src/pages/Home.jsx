import { useNavigate } from 'react-router-dom';
import { Package, Truck, Archive, Building2, CheckCircle, Clock, Star, ArrowRight } from 'lucide-react';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Package size={32} />
            <span>SmartMove</span>
          </div>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <button className="nav-btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn-primary" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="trust-badge">
              <CheckCircle size={16} />
              <span>Trusted by 10,000+ Customers</span>
            </div>
            
            <h1 className="hero-title">Your Stress-Free Moving Solution</h1>
            
            <p className="hero-description">
              Professional moving services that make relocation simple, safe, and affordable. 
              Start your move today in just a few clicks.
            </p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Get Started
                <ArrowRight size={20} />
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                View Services
              </button>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <CheckCircle size={20} />
                <span>Fully Insured & Licensed</span>
              </div>
              <div className="feature-item">
                <Clock size={20} />
                <span>On-Time Guarantee</span>
              </div>
              <div className="feature-item">
                <Star size={20} />
                <span>5-Star Rated Service</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-card">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=700&fit=crop" alt="Modern living room" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="section-container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive moving solutions tailored to your needs</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon cyan">
                <Truck size={32} />
              </div>
              <h3>Local Moving</h3>
              <p>Professional moving services within Nairobi, Kiambu, Nakuru and surrounding areas.</p>
              <a href="#" className="service-link">
                Learn more <ArrowRight size={16} />
              </a>
            </div>

            <div className="service-card">
              <div className="service-icon green">
                <Archive size={32} />
              </div>
              <h3>Packing Services</h3>
              <p>Expert packing with quality materials to protect your belongings.</p>
              <a href="#" className="service-link">
                Learn more <ArrowRight size={16} />
              </a>
            </div>

            <div className="service-card">
              <div className="service-icon purple">
                <Building2 size={32} />
              </div>
              <h3>Storage Solutions</h3>
              <p>Secure, climate-controlled storage facilities for short or long-term needs.</p>
              <a href="#" className="service-link">
                Learn more <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to a successful move</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Get Started</h3>
              <p>Fill out our simple form and receive an instant estimate for your move.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Schedule Your Move</h3>
              <p>Choose a date and time that works best for you.</p>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>We Handle the Rest</h3>
              <p>Our professional team takes care of everything from packing to delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Trusted by thousands of happy movers</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
              </div>
              <p className="testimonial-text">
                "SmartMove made our relocation stress-free! The team was professional, efficient, 
                and took great care of our belongings."
              </p>
              <div className="testimonial-author">
                <strong>Wanjiru Kamau</strong>
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
              </div>
              <p className="testimonial-text">
                "Best moving experience ever! They were punctual, careful, and the pricing was 
                exactly as quoted. Highly recommend!"
              </p>
              <div className="testimonial-author">
                <strong>David Ochieng</strong>
                <span>Kisumu, Kenya</span>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
              </div>
              <p className="testimonial-text">
                "From packing to unpacking, the SmartMove team was amazing. They handled 
                everything with care and professionalism."
              </p>
              <div className="testimonial-author">
                <strong>Grace Mwangi</strong>
                <span>Nakuru, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Make Your Move?</h2>
          <p>Get started in minutes. No hidden fees, no surprises.</p>
          <button className="cta-button" onClick={() => navigate('/register')}>
            Get Started Today
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Package size={28} />
                <span>SmartMove</span>
              </div>
              <p>Your trusted moving partner across Kenya.</p>
            </div>

            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#services">Services</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#testimonials">Testimonials</a>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@smartmove.co.ke</p>
              <p>Phone: +254 700 123 456</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SmartMove. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;