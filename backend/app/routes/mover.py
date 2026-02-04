from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.utils.decorators import role_required, get_current_user
from app.models import Booking, BookingStatus, Mover, Review
from datetime import datetime
from sqlalchemy import func, extract

bp = Blueprint('mover', __name__)

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required(['mover'])
def get_dashboard():
    """Get mover dashboard data"""
    try:
        user = get_current_user()
        mover = user.mover_profile
        
        if not mover:
            return jsonify({'error': 'Mover profile not found'}), 404
        
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        # Get active jobs
        active_jobs = Booking.query.filter_by(
            mover_id=mover.id,
            status=BookingStatus.IN_PROGRESS
        ).count()
        
        # Get earnings this month
        total_earnings = db.session.query(func.sum(Booking.total_price)).filter(
            Booking.mover_id == mover.id,
            Booking.status == BookingStatus.COMPLETED,
            extract('month', Booking.scheduled_date) == current_month,
            extract('year', Booking.scheduled_date) == current_year
        ).scalar() or 0
        
        # Get jobs completed this month
        jobs_this_month = Booking.query.filter(
            Booking.mover_id == mover.id,
            Booking.status == BookingStatus.COMPLETED,
            extract('month', Booking.scheduled_date) == current_month,
            extract('year', Booking.scheduled_date) == current_year
        ).count()
        
        # Get upcoming jobs
        upcoming_jobs = Booking.query.filter(
            Booking.mover_id == mover.id,
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS]),
            Booking.scheduled_date >= datetime.utcnow().date()
        ).order_by(Booking.scheduled_date.asc(), Booking.scheduled_time.asc()).limit(5).all()
        
        # Get recent reviews
        recent_reviews = Review.query.filter_by(
            mover_id=mover.id
        ).order_by(Review.created_at.desc()).limit(5).all()
        
        # Calculate on-time rate (simplified - assume 95% for now)
        on_time_rate = 95
        
        data = {
            'stats': {
                'active_jobs': active_jobs,
                'total_earnings_this_month': round(total_earnings, 2),
                'average_rating': round(mover.rating, 1),
                'total_jobs_completed': mover.total_jobs_completed
            },
            'upcoming_jobs': [
                {
                    'booking_ref': job.booking_reference,
                    'client_name': job.client.full_name if job.client else 'Unknown',
                    'date': job.scheduled_date.strftime('%b %d, %Y'),
                    'time': job.scheduled_time.strftime('%I:%M %p'),
                    'pickup': job.pickup_address,
                    'dropoff': job.dropoff_address,
                    'distance': job.distance_km,
                    'payment': job.total_price,
                    'status': job.status.value
                }
                for job in upcoming_jobs
            ],
            'recent_reviews': [review.to_dict() for review in recent_reviews],
            'performance': {
                'jobs_completed_this_month': jobs_this_month,
                'on_time_rate': on_time_rate,
                'customer_satisfaction': round(mover.rating, 1)
            }
        }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/jobs', methods=['GET'])
@jwt_required()
@role_required(['mover'])
def get_jobs():
    """Get all mover jobs with filters"""
    try:
        user = get_current_user()
        mover = user.mover_profile
        
        if not mover:
            return jsonify({'error': 'Mover profile not found'}), 404
        
        # Get filter parameters
        status_filter = request.args.get('status', 'all')
        
        # Base query
        query = Booking.query.filter_by(mover_id=mover.id)
        
        # Apply status filter
        if status_filter != 'all':
            try:
                status = BookingStatus(status_filter)
                query = query.filter_by(status=status)
            except ValueError:
                pass
        
        # Order by date
        jobs = query.order_by(Booking.scheduled_date.desc()).all()
        
        data = {
            'jobs': [
                {
                    'id': job.id,
                    'booking_ref': job.booking_reference,
                    'client_name': job.client.full_name if job.client else 'Unknown',
                    'client_phone': job.client.phone_number if job.client else None,
                    'date': job.scheduled_date.strftime('%b %d, %Y'),
                    'time': job.scheduled_time.strftime('%I:%M %p'),
                    'pickup': job.pickup_address,
                    'dropoff': job.dropoff_address,
                    'distance': job.distance_km,
                    'items_count': job.total_volume * 2,  # Approximation
                    'volume': job.total_volume,
                    'payment': job.total_price,
                    'status': job.status.value
                }
                for job in jobs
            ],
            'total': len(jobs)
        }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/profile', methods=['GET'])
@jwt_required()
@role_required(['mover'])
def get_profile():
    """Get mover profile"""
    try:
        user = get_current_user()
        mover = user.mover_profile
        
        if not mover:
            return jsonify({'error': 'Mover profile not found'}), 404
        
        return jsonify({
            'profile': mover.to_dict(include_user=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
