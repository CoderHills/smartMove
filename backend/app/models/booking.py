from app import db
from datetime import datetime
from enum import Enum
import string
import random

class BookingStatus(str, Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_reference = db.Column(db.String(50), unique=True, nullable=False, index=True)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mover_id = db.Column(db.Integer, db.ForeignKey('movers.id'), nullable=False)
    status = db.Column(db.Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    
    # Pickup details
    pickup_address = db.Column(db.String(500), nullable=False)
    pickup_latitude = db.Column(db.Float)
    pickup_longitude = db.Column(db.Float)
    pickup_floor = db.Column(db.String(50))
    pickup_details = db.Column(db.Text)
    
    # Dropoff details
    dropoff_address = db.Column(db.String(500), nullable=False)
    dropoff_latitude = db.Column(db.Float)
    dropoff_longitude = db.Column(db.Float)
    dropoff_floor = db.Column(db.String(50))
    dropoff_details = db.Column(db.Text)
    
    # Schedule
    scheduled_date = db.Column(db.Date, nullable=False)
    scheduled_time = db.Column(db.Time, nullable=False)
    estimated_duration = db.Column(db.Integer)  # in minutes
    actual_start_time = db.Column(db.DateTime)
    actual_end_time = db.Column(db.DateTime)
    
    # Logistics
    distance_km = db.Column(db.Float, nullable=False)
    total_volume = db.Column(db.Float, nullable=False)  # cubic meters
    
    # Pricing
    base_price = db.Column(db.Float, nullable=False)
    labor_cost = db.Column(db.Float, default=0.0)
    packing_materials_cost = db.Column(db.Float, default=0.0)
    service_fee = db.Column(db.Float, default=0.0)
    total_price = db.Column(db.Float, nullable=False)
    
    # Additional
    special_instructions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    status_updates = db.relationship('BookingStatusUpdate', backref='booking', lazy='dynamic', 
                                    cascade='all, delete-orphan', order_by='BookingStatusUpdate.created_at')
    review = db.relationship('Review', backref='booking', uselist=False, cascade='all, delete-orphan')
    
    @staticmethod
    def generate_reference():
        """Generate unique booking reference"""
        year = datetime.utcnow().year
        random_part = ''.join(random.choices(string.digits, k=3))
        return f"BK-{year}-{random_part}"
    
    def to_dict(self, include_client=False, include_mover=False):
        """Convert booking to dictionary"""
        data = {
            'id': self.id,
            'booking_reference': self.booking_reference,
            'status': self.status.value,
            'pickup_address': self.pickup_address,
            'pickup_floor': self.pickup_floor,
            'pickup_details': self.pickup_details,
            'dropoff_address': self.dropoff_address,
            'dropoff_floor': self.dropoff_floor,
            'dropoff_details': self.dropoff_details,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'estimated_duration': self.estimated_duration,
            'distance_km': self.distance_km,
            'total_volume': self.total_volume,
            'pricing': {
                'base_price': self.base_price,
                'labor_cost': self.labor_cost,
                'packing_materials_cost': self.packing_materials_cost,
                'service_fee': self.service_fee,
                'total': self.total_price
            },
            'special_instructions': self.special_instructions,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        if include_client and self.client:
            data['client'] = {
                'id': self.client.id,
                'name': self.client.full_name,
                'email': self.client.email,
                'phone': self.client.phone_number
            }
        
        if include_mover and self.mover:
            data['mover'] = self.mover.to_dict(include_user=True)
        
        return data
    
    def __repr__(self):
        return f'<Booking {self.booking_reference}>'
