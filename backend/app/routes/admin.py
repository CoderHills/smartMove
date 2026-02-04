from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.utils.decorators import role_required, get_current_user
from app.models import User, Mover, Booking, BookingStatus, UserRole
from datetime import datetime
from sqlalchemy import func, extract

bp = Blueprint('admin', __name__)

@bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_dashboard():
    """Get admin dashboard statistics"""
    try:
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        last_month = current_month - 1 if current_month > 1 else 12
        
        # Total users
        total_users = User.query.count()
        last_month_users = User.query.filter(
            extract('month', User.created_at) == last_month
        ).count()
        user_growth = round((total_users - last_month_users) / max(last_month_users, 1) * 100)
        
        # Active movers
        active_movers = Mover.query.filter_by(is_approved=True, is_available=True).count()
        
        # Total bookings
        total_bookings = Booking.query.count()
        last_month_bookings = Booking.query.filter(
            extract('month', Booking.created_at) == last_month
        ).count()
        booking_growth = round((total_bookings - last_month_bookings) / max(last_month_bookings, 1) * 100)
        
        # Revenue this month
        revenue = db.session.query(func.sum(Booking.total_price)).filter(
            Booking.status == BookingStatus.COMPLETED,
            extract('month', Booking.scheduled_date) == current_month,
            extract('year', Booking.scheduled_date) == current_year
        ).scalar() or 0
        
        last_month_revenue = db.session.query(func.sum(Booking.total_price)).filter(
            Booking.status == BookingStatus.COMPLETED,
            extract('month', Booking.scheduled_date) == last_month
        ).scalar() or 1
        
        revenue_growth = round((revenue - last_month_revenue) / last_month_revenue * 100)
        
        # Pending mover approvals
        pending_movers = Mover.query.filter_by(is_approved=False).all()
        
        # Recent bookings
        recent_bookings = Booking.query.order_by(
            Booking.created_at.desc()
        ).limit(10).all()
        
        # Quick stats
        active_today = Booking.query.filter(
            Booking.scheduled_date == datetime.utcnow().date(),
            Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS])
        ).count()
        
        new_users_today = User.query.filter(
            func.date(User.created_at) == datetime.utcnow().date()
        ).count()
        
        # Completion rate
        completed = Booking.query.filter_by(status=BookingStatus.COMPLETED).count()
        completion_rate = round(completed / max(total_bookings, 1) * 100)
        
        # Average rating across all movers
        avg_rating = db.session.query(func.avg(Mover.rating)).scalar() or 0
        
        # Top movers
        top_movers = Mover.query.filter_by(is_approved=True).order_by(
            Mover.total_jobs_completed.desc(), Mover.rating.desc()
        ).limit(3).all()
        
        data = {
            'stats': {
                'total_users': total_users,
                'active_movers': active_movers,
                'total_bookings': total_bookings,
                'revenue_this_month': round(revenue, 2),
                'growth': {
                    'users': f'+{user_growth}%' if user_growth > 0 else f'{user_growth}%',
                    'movers': f'+{Mover.query.filter(extract("month", Mover.created_at) == current_month).count()}',
                    'bookings': f'+{booking_growth}%' if booking_growth > 0 else f'{booking_growth}%',
                    'revenue': f'+{revenue_growth}%' if revenue_growth > 0 else f'{revenue_growth}%'
                }
            },
            'pending_movers': [
                {
                    'id': mover.id,
                    'company_name': mover.company_name,
                    'email': mover.user.email if mover.user else None,
                    'registration_number': mover.registration_number or f'REG-{current_year}-{str(mover.id).zfill(3)}',
                    'applied_on': mover.created_at.strftime('%b %d, %Y') if mover.created_at else None,
                    'coverage_zone': ', '.join(mover.coverage_zones) if mover.coverage_zones else 'Not specified'
                }
                for mover in pending_movers
            ],
            'recent_bookings': [
                {
                    'booking_id': booking.booking_reference,
                    'client': booking.client.full_name if booking.client else 'Unknown',
                    'mover': booking.mover.company_name if booking.mover else 'Unassigned',
                    'date': booking.scheduled_date.strftime('%b %d, %Y'),
                    'amount': booking.total_price,
                    'status': booking.status.value
                }
                for booking in recent_bookings
            ],
            'platform_health': {
                'system_status': 'Operational',
                'pending_reviews': 12  # Mock value
            },
            'quick_stats': {
                'active_bookings_today': active_today,
                'new_users_today': new_users_today,
                'completion_rate': completion_rate,
                'average_rating': round(avg_rating, 1)
            },
            'top_movers': [
                {
                    'rank': idx + 1,
                    'name': mover.company_name,
                    'jobs': mover.total_jobs_completed,
                    'rating': round(mover.rating, 1)
                }
                for idx, mover in enumerate(top_movers)
            ]
        }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/movers/pending', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_pending_movers():
    """Get all pending mover approvals"""
    try:
        movers = Mover.query.filter_by(is_approved=False).all()
        return jsonify({
            'movers': [mover.to_dict(include_user=True) for mover in movers]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/movers/<int:mover_id>/approve', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def approve_mover(mover_id):
    """Approve mover registration"""
    try:
        mover = Mover.query.get(mover_id)
        if not mover:
            return jsonify({'error': 'Mover not found'}), 404
        
        mover.is_approved = True
        mover.is_available = True
        db.session.commit()
        
        return jsonify({
            'message': 'Mover approved successfully',
            'mover': mover.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/movers/<int:mover_id>/reject', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def reject_mover(mover_id):
    """Reject mover registration"""
    try:
        mover = Mover.query.get(mover_id)
        if not mover:
            return jsonify({'error': 'Mover not found'}), 404
        
        # Delete mover profile and user account
        user = mover.user
        db.session.delete(mover)
        if user:
            db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'Mover rejected and removed'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/users', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify({
            'users': [user.to_dict() for user in users],
            'total': len(users)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/bookings', methods=['GET'])
@jwt_required()
@role_required(['admin'])
def get_all_bookings():
    """Get all bookings"""
    try:
        bookings = Booking.query.order_by(Booking.created_at.desc()).all()
        return jsonify({
            'bookings': [booking.to_dict(include_client=True, include_mover=True) for booking in bookings],
            'total': len(bookings)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
