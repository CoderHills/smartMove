from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User, UserRole

def role_required(allowed_roles):
    """
    Decorator to check if user has required role
    Usage: @role_required(['client', 'admin'])
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            if user.role.value not in allowed_roles:
                return jsonify({'error': 'Access denied. Insufficient permissions'}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def get_current_user():
    """Get current authenticated user"""
    user_id = get_jwt_identity()
    return User.query.get(user_id)
