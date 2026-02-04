from app import db
from datetime import datetime
from enum import Enum

class RoomType(str, Enum):
    BEDSITTER = 'bedsitter'
    STUDIO = 'studio'
    ONE_BR = '1br'
    TWO_BR = '2br'

class InventoryTemplate(db.Model):
    __tablename__ = 'inventory_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    room_type = db.Column(db.Enum(RoomType), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    default_quantity = db.Column(db.Integer, default=0)
    estimated_volume = db.Column(db.Float, default=0.0)  # cubic meters per item
    category = db.Column(db.String(100))
    
    def to_dict(self):
        return {
            'id': self.id,
            'room_type': self.room_type.value,
            'item_name': self.item_name,
            'default_quantity': self.default_quantity,
            'estimated_volume': self.estimated_volume,
            'category': self.category
        }

class UserInventory(db.Model):
    __tablename__ = 'user_inventories'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=True)
    room_type = db.Column(db.Enum(RoomType), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('InventoryItem', backref='inventory', lazy='dynamic', cascade='all, delete-orphan')
    
    def calculate_total_volume(self):
        """Calculate total volume from all items"""
        return sum(item.quantity * item.estimated_volume for item in self.items.all())
    
    def to_dict(self):
        return {
            'id': self.id,
            'room_type': self.room_type.value,
            'total_items': self.items.count(),
            'total_volume': self.calculate_total_volume(),
            'items': [item.to_dict() for item in self.items.all()],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class InventoryItem(db.Model):
    __tablename__ = 'inventory_items'
    
    id = db.Column(db.Integer, primary_key=True)
    inventory_id = db.Column(db.Integer, db.ForeignKey('user_inventories.id'), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    estimated_volume = db.Column(db.Float, default=0.0)
    is_custom = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'item_name': self.item_name,
            'quantity': self.quantity,
            'estimated_volume': self.estimated_volume,
            'is_custom': self.is_custom,
            'notes': self.notes
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), unique=True, nullable=False)
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mover_id = db.Column(db.Integer, db.ForeignKey('movers.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    response = db.Column(db.Text)  # Mover's response
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'booking_reference': self.booking.booking_reference if self.booking else None,
            'rating': self.rating,
            'comment': self.comment,
            'response': self.response,
            'client_name': self.reviewer.full_name if self.reviewer else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class BookingStatusUpdate(db.Model):
    __tablename__ = 'booking_status_updates'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    notes = db.Column(db.Text)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'notes': self.notes,
            'timestamp': self.created_at.isoformat() if self.created_at else None,
        }
