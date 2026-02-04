from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.utils.decorators import role_required, get_current_user
from app.models import Booking, BookingStatus
from datetime import datetime

bp = Blueprint('client', __name__)

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required(['client'])
def get_dashboard():
    """Get client dashboard data"""
    try:
        user = get_current_user()
        
        # Get active/upcoming bookings
        active_booking = Booking.query.filter_by(
            client_id=user.id,
            status=BookingStatus.IN_PROGRESS
        ).first()
        
        upcoming_booking = Booking.query.filter(
            Booking.client_id == user.id,
            Booking.status == BookingStatus.CONFIRMED,
            Booking.scheduled_date >= datetime.utcnow().date()
        ).order_by(Booking.scheduled_date.asc()).first()
        
        # Get booking history count
        completed_bookings = Booking.query.filter_by(
            client_id=user.id,
            status=BookingStatus.COMPLETED
        ).count()
        
        data = {
            'current_move': None,
            'upcoming_move': None,
            'stats': {
                'completed_moves': completed_bookings,
                'total_bookings': user.client_bookings.count()
            }
        }
        
        if active_booking:
            data['current_move'] = {
                'status': active_booking.status.value,
                'booking_reference': active_booking.booking_reference,
                'pickup_location': active_booking.pickup_address,
                'dropoff_location': active_booking.dropoff_address,
                'estimated_completion': f"Today, {active_booking.scheduled_time.strftime('%I:%M %p')}",
                'mover': active_booking.mover.company_name if active_booking.mover else None
            }
        
        if upcoming_booking:
            data['upcoming_move'] = {
                'date': upcoming_booking.scheduled_date.strftime('%b %d, %Y'),
                'time': upcoming_booking.scheduled_time.strftime('%I:%M %p'),
                'booking_reference': upcoming_booking.booking_reference,
                'mover': upcoming_booking.mover.company_name if upcoming_booking.mover else None
            }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
