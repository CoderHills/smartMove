from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app import db
from app.utils.decorators import get_current_user
from app.models import InventoryTemplate, UserInventory, InventoryItem, RoomType

bp = Blueprint('inventory', __name__)

@bp.route('/templates', methods=['GET'])
def get_templates():
    """Get inventory templates by room type"""
    try:
        room_type = request.args.get('room_type')
        
        query = InventoryTemplate.query
        if room_type:
            try:
                query = query.filter_by(room_type=RoomType(room_type))
            except ValueError:
                return jsonify({'error': 'Invalid room type'}), 400
        
        templates = query.all()
        
        # Group by room type
        grouped = {}
        for template in templates:
            room = template.room_type.value
            if room not in grouped:
                grouped[room] = []
            grouped[room].append(template.to_dict())
        
        return jsonify({'templates': grouped}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/', methods=['POST'])
@jwt_required()
def create_inventory():
    """Create new user inventory"""
    try:
        user = get_current_user()
        data = request.get_json()
        
        # Validate room type
        try:
            room_type = RoomType(data.get('room_type'))
        except ValueError:
            return jsonify({'error': 'Invalid room type'}), 400
        
        # Create inventory
        inventory = UserInventory(
            user_id=user.id,
            room_type=room_type
        )
        db.session.add(inventory)
        db.session.flush()
        
        # Add items
        items = data.get('items', [])
        for item_data in items:
            if item_data.get('quantity', 0) > 0:
                item = InventoryItem(
                    inventory_id=inventory.id,
                    item_name=item_data['item_name'],
                    quantity=item_data['quantity'],
                    estimated_volume=item_data.get('estimated_volume', 0.0),
                    is_custom=item_data.get('is_custom', False),
                    notes=item_data.get('notes')
                )
                db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Inventory created successfully',
            'inventory': inventory.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/my-inventories', methods=['GET'])
@jwt_required()
def get_user_inventories():
    """Get all user inventories"""
    try:
        user = get_current_user()
        inventories = UserInventory.query.filter_by(user_id=user.id).all()
        
        return jsonify({
            'inventories': [inv.to_dict() for inv in inventories]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:inventory_id>', methods=['GET'])
@jwt_required()
def get_inventory(inventory_id):
    """Get specific inventory"""
    try:
        user = get_current_user()
        inventory = UserInventory.query.filter_by(
            id=inventory_id,
            user_id=user.id
        ).first()
        
        if not inventory:
            return jsonify({'error': 'Inventory not found'}), 404
        
        return jsonify({'inventory': inventory.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:inventory_id>', methods=['PUT'])
@jwt_required()
def update_inventory(inventory_id):
    """Update inventory"""
    try:
        user = get_current_user()
        inventory = UserInventory.query.filter_by(
            id=inventory_id,
            user_id=user.id
        ).first()
        
        if not inventory:
            return jsonify({'error': 'Inventory not found'}), 404
        
        data = request.get_json()
        
        # Update items
        if 'items' in data:
            # Delete existing items
            InventoryItem.query.filter_by(inventory_id=inventory.id).delete()
            
            # Add new items
            for item_data in data['items']:
                if item_data.get('quantity', 0) > 0:
                    item = InventoryItem(
                        inventory_id=inventory.id,
                        item_name=item_data['item_name'],
                        quantity=item_data['quantity'],
                        estimated_volume=item_data.get('estimated_volume', 0.0),
                        is_custom=item_data.get('is_custom', False),
                        notes=item_data.get('notes')
                    )
                    db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Inventory updated successfully',
            'inventory': inventory.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:inventory_id>', methods=['DELETE'])
@jwt_required()
def delete_inventory(inventory_id):
    """Delete inventory"""
    try:
        user = get_current_user()
        inventory = UserInventory.query.filter_by(
            id=inventory_id,
            user_id=user.id
        ).first()
        
        if not inventory:
            return jsonify({'error': 'Inventory not found'}), 404
        
        db.session.delete(inventory)
        db.session.commit()
        
        return jsonify({'message': 'Inventory deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
