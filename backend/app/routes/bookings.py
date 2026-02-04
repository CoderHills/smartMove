from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.utils.decorators import get_current_user, role_required
from app.models import Booking, BookingStatus, Mover, BookingStatusUpdate
from datetime import datetime

bp = Blueprint('bookings', __name__)

def calculate_pricing(distance_km, total_volume, mover):
    """Calculate booking price"""
    base_price = distance_km * mover.base_price_per_km
    volume_price = total_volume * mover.price_per_cubic_meter
    
    # Labor cost based on volume (more items = more workers/time)
    if total_volume <= 5:
        labor_cost = 1000
    elif total_volume <= 10:
        labor_cost = 2000
    else:
        labor_cost = 3000
    
    # Packing materials based on volume
    packing_cost = total_volume * 100
    
    # Service fee (platform fee - 10%)
    service_fee = 0  # Free for clients (charged to movers)
    
    total = base_price + volume_price + labor_cost + packing_cost + service_fee
    
    return {
        'base_price': round(base_price, 2),
        'labor_cost': round(labor_cost, 2),
        'packing_materials_cost': round(packing_cost, 2),
        'service_fee': round(service_fee, 2),
        'total_price': round(total, 2)
    }

@bp.route('/movers', methods=['GET'])
def get_movers():
    """Get all approved movers"""
    try:
        movers = Mover.query.filter_by(
            is_approved=True,
            is_available=True
        ).all()
        
        movers_data = []
        for mover in movers:
            mover_dict = mover.to_dict(include_user=True)
            # Add estimated time (mock calculation)
            mover_dict['estimated_time'] = '4-5 hours'
            movers_data.append(mover_dict)
        
        return jsonify({'movers': movers_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/estimate', methods=['POST'])
@jwt_required()
def calculate_estimate():
    """Calculate price estimate"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['mover_id', 'distance_km', 'total_volume']
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        mover = Mover.query.get(data['mover_id'])
        if not mover:
            return jsonify({'error': 'Mover not found'}), 404
        
        pricing = calculate_pricing(
            distance_km=data['distance_km'],
            total_volume=data['total_volume'],
            mover=mover
        )
        
        return jsonify({
            'estimate': pricing,
            'mover': mover.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['client'])
def create_booking():
    """Create a new booking"""
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Validate required fields
        required = [
            'mover_id', 'pickup_address', 'dropoff_address',
            'scheduled_date', 'scheduled_time', 'distance_km', 'total_volume'
        ]
        for field in required:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get mover
        mover = Mover.query.get(data['mover_id'])
        if not mover:
            return jsonify({'error': 'Mover not found'}), 404
        
        if not mover.is_approved or not mover.is_available:
            return jsonify({'error': 'Mover is not available'}), 400
        
        # Calculate pricing
        pricing = calculate_pricing(
            distance_km=data['distance_km'],
            total_volume=data['total_volume'],
            mover=mover
        )
        
        # Parse date and time
        scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date()
        scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
        
        # Create booking
        booking = Booking(
            booking_reference=Booking.generate_reference(),
            client_id=user.id,
            mover_id=mover.id,
            status=BookingStatus.CONFIRMED,
            pickup_address=data['pickup_address'],
            pickup_latitude=data.get('pickup_latitude'),
            pickup_longitude=data.get('pickup_longitude'),
            pickup_floor=data.get('pickup_floor'),
            pickup_details=data.get('pickup_details'),
            dropoff_address=data['dropoff_address'],
            dropoff_latitude=data.get('dropoff_latitude'),
            dropoff_longitude=data.get('dropoff_longitude'),
            dropoff_floor=data.get('dropoff_floor'),
            dropoff_details=data.get('dropoff_details'),
            scheduled_date=scheduled_date,
            scheduled_time=scheduled_time,
            distance_km=data['distance_km'],
            total_volume=data['total_volume'],
            base_price=pricing['base_price'],
            labor_cost=pricing['labor_cost'],
            packing_materials_cost=pricing['packing_materials_cost'],
            service_fee=pricing['service_fee'],
            total_price=pricing['total_price'],
            special_instructions=data.get('special_instructions')
        )
        
        db.session.add(booking)
        db.session.flush()
        
        # Add initial status update
        status_update = BookingStatusUpdate(
            booking_id=booking.id,
            status='Booking Confirmed',
            notes='Booking created successfully',
            updated_by=user.id
        )
        db.session.add(status_update)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Booking created successfully',
            'booking': booking.to_dict(include_mover=True)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:booking_id>', methods=['GET'])
@jwt_required()
def get_booking(booking_id):
    """Get booking details"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check authorization
        if user.role.value == 'client' and booking.client_id != user.id:
            return jsonify({'error': 'Access denied'}), 403
        elif user.role.value == 'mover' and booking.mover_id != user.mover_profile.id:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'booking': booking.to_dict(include_client=True, include_mover=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:booking_id>/tracking', methods=['GET'])
@jwt_required()
def get_tracking(booking_id):
    """Get booking tracking information"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        # Check authorization
        if user.role.value == 'client' and booking.client_id != user.id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get status updates
        updates = booking.status_updates.all()
        
        # Mock current location for demo
        current_location = 'Mombasa Road, Nairobi'
        estimated_arrival = '2:00 PM'
        distance_remaining = 8.5
        
        data = {
            'status': booking.status.value,
            'current_location': current_location,
            'estimated_arrival': estimated_arrival,
            'distance_remaining': distance_remaining,
            'mover': {
                'name': booking.mover.company_name if booking.mover else None,
                'team_lead': 'John Kamau',  # Mock
                'phone': booking.mover.user.phone_number if booking.mover and booking.mover.user else None
            },
            'vehicle': {
                'type': booking.mover.vehicle_type if booking.mover else 'Truck (5 ton)',
                'plate_number': 'KBZ 123X',  # Mock
                'crew_members': 3  # Mock
            },
            'status_updates': [
                {
                    'status': update.status,
                    'timestamp': update.created_at.strftime('%b %d, %Y - %I:%M %p'),
                    'completed': True if update != updates[-1] else False,
                    'active': True if update == updates[-1] else False
                }
                for update in updates
            ]
        }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
@role_required(['mover'])
def update_booking_status(booking_id):
    """Update booking status (mover only)"""
    try:
        user = get_current_user()
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        if booking.mover_id != user.mover_profile.id:
            return jsonify({'error': 'Access denied'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        # Validate status
        try:
            status_enum = BookingStatus(new_status)
            booking.status = status_enum
        except ValueError:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Add status update
        status_update = BookingStatusUpdate(
            booking_id=booking.id,
            status=data.get('status_message', new_status),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            notes=data.get('notes'),
            updated_by=user.id
        )
        db.session.add(status_update)
        
        # Update mover stats if completed
        if status_enum == BookingStatus.COMPLETED:
            mover = user.mover_profile
            mover.total_jobs_completed += 1
            mover.rating = mover.calculate_rating()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Status updated successfully',
            'booking': booking.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
