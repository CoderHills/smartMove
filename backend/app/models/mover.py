from app import db
from datetime import datetime

class Mover(db.Model):
    __tablename__ = 'movers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    registration_number = db.Column(db.String(100), unique=True)
    license_number = db.Column(db.String(100))
    vehicle_type = db.Column(db.String(100))
    vehicle_capacity = db.Column(db.Float, default=10.0)  # in cubic meters
    coverage_zones = db.Column(db.JSON)  # List of locations
    base_price_per_km = db.Column(db.Float, default=100.0)
    price_per_cubic_meter = db.Column(db.Float, default=500.0)
    is_approved = db.Column(db.Boolean, default=False)
    is_available = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=0.0)
    total_jobs_completed = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', foreign_keys='Booking.mover_id', backref='mover', lazy='dynamic')
    reviews = db.relationship('Review', foreign_keys='Review.mover_id', backref='reviewed_mover', lazy='dynamic')
    
    def calculate_rating(self):
        """Calculate average rating from reviews"""
        reviews = self.reviews.all()
        if not reviews:
            return 0.0
        return sum(review.rating for review in reviews) / len(reviews)
    
    def to_dict(self, include_user=False):
        """Convert mover to dictionary"""
        data = {
            'id': self.id,
            'company_name': self.company_name,
            'registration_number': self.registration_number,
            'vehicle_type': self.vehicle_type,
            'vehicle_capacity': self.vehicle_capacity,
            'coverage_zones': self.coverage_zones,
            'base_price_per_km': self.base_price_per_km,
            'price_per_cubic_meter': self.price_per_cubic_meter,
            'is_approved': self.is_approved,
            'is_available': self.is_available,
            'rating': round(self.rating, 1),
            'total_jobs_completed': self.total_jobs_completed,
            'review_count': self.reviews.count(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if include_user and self.user:
            data['contact_email'] = self.user.email
            data['contact_phone'] = self.user.phone_number
            data['contact_name'] = self.user.full_name
        
        return data
    
    def __repr__(self):
        return f'<Mover {self.company_name}>'
