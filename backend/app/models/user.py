from app import db, bcrypt
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CLIENT = 'client'
    MOVER = 'mover'
    ADMIN = 'admin'

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.CLIENT)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    profile_image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    mover_profile = db.relationship('Mover', backref='user', uselist=False, cascade='all, delete-orphan')
    client_bookings = db.relationship('Booking', foreign_keys='Booking.client_id', backref='client', lazy='dynamic')
    inventories = db.relationship('UserInventory', backref='user', lazy='dynamic', cascade='all, delete-orphan')
    reviews_given = db.relationship('Review', foreign_keys='Review.client_id', backref='reviewer', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Check if password matches hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone_number': self.phone_number,
            'role': self.role.value,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'profile_image_url': self.profile_image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        
        # Add mover-specific data if user is a mover
        if self.role == UserRole.MOVER and self.mover_profile:
            data['mover_profile'] = self.mover_profile.to_dict()
        
        return data
    
    def __repr__(self):
        return f'<User {self.email} - {self.role.value}>'
