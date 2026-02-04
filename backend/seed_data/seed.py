from app import create_app, db
from app.models import (
    User, UserRole, Mover, Booking, BookingStatus,
    InventoryTemplate, RoomType, Review, BookingStatusUpdate
)
from datetime import datetime, timedelta, time
import random

def seed_database():
    """Seed database with sample data"""
    app = create_app()
    
    with app.app_context():
        print("🗑️  Clearing existing data...")
        db.drop_all()
        
        print("📦 Creating tables...")
        db.create_all()
        
        print("👤 Creating users...")
        
        # Create Admin
        admin = User(
            email='admin@smartmove.com',
            full_name='Admin User',
            phone_number='+254 700 000 000',
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create Sample Clients
        clients = []
        client_names = [
            ('John Doe', '+254 700 123 456', 'john@example.com'),
            ('Jane Smith', '+254 700 234 567', 'jane@example.com'),
            ('Michael Brown', '+254 700 345 678', 'michael@example.com'),
            ('Sarah Wilson', '+254 700 456 789', 'sarah@example.com'),
            ('Alice Johnson', '+254 700 567 890', 'alice@example.com'),
        ]
        
        for name, phone, email in client_names:
            client = User(
                email=email,
                full_name=name,
                phone_number=phone,
                role=UserRole.CLIENT,
                is_active=True,
                is_verified=True
            )
            client.set_password('password123')
            clients.append(client)
            db.session.add(client)
        
        # Create Mover Users and Profiles
        print("🚚 Creating movers...")
        movers_data = [
            {
                'name': 'Swift Movers Ltd',
                'email': 'contact@swiftmovers.co.ke',
                'phone': '+254 700 123 456',
                'registration': 'REG-2024-001',
                'vehicle': 'Truck (5 ton)',
                'capacity': 15.0,
                'zones': ['Nairobi', 'Kiambu', 'Westlands'],
                'base_price_km': 100,
                'price_m3': 500,
                'rating': 4.8,
                'jobs': 124
            },
            {
                'name': 'Premium Relocations',
                'email': 'info@premiumrelocations.co.ke',
                'phone': '+254 700 234 567',
                'registration': 'REG-2024-002',
                'vehicle': 'Truck (7 ton)',
                'capacity': 20.0,
                'zones': ['Nairobi', 'Mombasa', 'Nakuru'],
                'base_price_km': 120,
                'price_m3': 600,
                'rating': 4.9,
                'jobs': 89
            },
            {
                'name': 'Easy Move Services',
                'email': 'hello@easymove.co.ke',
                'phone': '+254 700 345 678',
                'registration': 'REG-2024-003',
                'vehicle': 'Van (3 ton)',
                'capacity': 10.0,
                'zones': ['Nairobi', 'Kileleshwa', 'Parklands'],
                'base_price_km': 80,
                'price_m3': 450,
                'rating': 4.6,
                'jobs': 156
            },
            {
                'name': 'City Movers Pro',
                'email': 'support@citymovers.co.ke',
                'phone': '+254 700 456 789',
                'registration': 'REG-2024-004',
                'vehicle': 'Truck (6 ton)',
                'capacity': 18.0,
                'zones': ['Nairobi', 'Karen', 'Lavington'],
                'base_price_km': 110,
                'price_m3': 550,
                'rating': 4.7,
                'jobs': 203
            },
        ]
        
        movers = []
        for m_data in movers_data:
            # Create user
            user = User(
                email=m_data['email'],
                full_name=m_data['name'],
                phone_number=m_data['phone'],
                role=UserRole.MOVER,
                is_active=True,
                is_verified=True
            )
            user.set_password('mover123')
            db.session.add(user)
            db.session.flush()
            
            # Create mover profile
            mover = Mover(
                user_id=user.id,
                company_name=m_data['name'],
                registration_number=m_data['registration'],
                vehicle_type=m_data['vehicle'],
                vehicle_capacity=m_data['capacity'],
                coverage_zones=m_data['zones'],
                base_price_per_km=m_data['base_price_km'],
                price_per_cubic_meter=m_data['price_m3'],
                is_approved=True,
                is_available=True,
                rating=m_data['rating'],
                total_jobs_completed=m_data['jobs']
            )
            movers.append(mover)
            db.session.add(mover)
        
        # Create Pending Movers (for admin approval)
        pending_movers_data = [
            ('Express Movers Ltd', 'express@movers.co.ke', '+254 711 111 111', ['Nairobi', 'Kiambu']),
            ('Reliable Logistics', 'info@reliable.co.ke', '+254 722 222 222', ['Mombasa', 'Kilifi']),
            ('SwiftShift Services', 'contact@swiftshift.ke', '+254 733 333 333', ['Nakuru', 'Naivasha']),
        ]
        
        for name, email, phone, zones in pending_movers_data:
            user = User(
                email=email,
                full_name=name,
                phone_number=phone,
                role=UserRole.MOVER,
                is_active=True
            )
            user.set_password('pending123')
            db.session.add(user)
            db.session.flush()
            
            mover = Mover(
                user_id=user.id,
                company_name=name,
                coverage_zones=zones,
                is_approved=False,
                is_available=False
            )
            db.session.add(mover)
        
        db.session.commit()
        
        # Create Inventory Templates
        print("📋 Creating inventory templates...")
        templates_data = {
            RoomType.BEDSITTER: [
                ('Bed (Queen/King)', 1, 2.5, 'furniture'),
                ('Mattress', 1, 1.5, 'furniture'),
                ('Wardrobe', 1, 3.0, 'furniture'),
                ('Desk', 1, 1.2, 'furniture'),
                ('Office Chair', 1, 0.5, 'furniture'),
                ('TV Stand', 1, 0.8, 'furniture'),
                ('Kitchenware', 5, 0.3, 'appliances'),
                ('Boxes', 10, 0.1, 'boxes'),
            ],
            RoomType.STUDIO: [
                ('Bed (Queen/King)', 1, 2.5, 'furniture'),
                ('Mattress', 1, 1.5, 'furniture'),
                ('Wardrobe', 1, 3.0, 'furniture'),
                ('Sofa', 1, 2.0, 'furniture'),
                ('Coffee Table', 1, 0.6, 'furniture'),
                ('TV Stand', 1, 0.8, 'furniture'),
                ('Desk', 1, 1.2, 'furniture'),
                ('Office Chair', 1, 0.5, 'furniture'),
                ('Kitchenware', 8, 0.3, 'appliances'),
                ('Boxes', 12, 0.1, 'boxes'),
            ],
            RoomType.ONE_BR: [
                ('Bed (Queen/King)', 1, 2.5, 'furniture'),
                ('Mattress', 1, 1.5, 'furniture'),
                ('Wardrobe', 2, 3.0, 'furniture'),
                ('Desk', 1, 1.2, 'furniture'),
                ('Office Chair', 1, 0.5, 'furniture'),
                ('Sofa', 1, 2.0, 'furniture'),
                ('Coffee Table', 1, 0.6, 'furniture'),
                ('TV Stand', 1, 0.8, 'furniture'),
                ('Dining Table', 1, 1.5, 'furniture'),
                ('Dining Chairs (4)', 1, 0.8, 'furniture'),
                ('Bookshelves', 2, 1.0, 'furniture'),
                ('Kitchenware', 10, 0.3, 'appliances'),
                ('Boxes', 15, 0.1, 'boxes'),
            ],
            RoomType.TWO_BR: [
                ('Bed (Queen/King)', 2, 2.5, 'furniture'),
                ('Mattress', 2, 1.5, 'furniture'),
                ('Wardrobe', 3, 3.0, 'furniture'),
                ('Desk', 1, 1.2, 'furniture'),
                ('Office Chair', 1, 0.5, 'furniture'),
                ('Sofa', 1, 2.0, 'furniture'),
                ('Coffee Table', 1, 0.6, 'furniture'),
                ('TV Stand', 1, 0.8, 'furniture'),
                ('Dining Table', 1, 1.5, 'furniture'),
                ('Dining Chairs (6)', 1, 1.2, 'furniture'),
                ('Bookshelves', 3, 1.0, 'furniture'),
                ('Kitchenware', 15, 0.3, 'appliances'),
                ('Boxes', 20, 0.1, 'boxes'),
            ],
        }
        
        for room_type, items in templates_data.items():
            for item_name, qty, volume, category in items:
                template = InventoryTemplate(
                    room_type=room_type,
                    item_name=item_name,
                    default_quantity=qty,
                    estimated_volume=volume,
                    category=category
                )
                db.session.add(template)
        
        db.session.commit()
        
        # Create Sample Bookings
        print("📅 Creating bookings...")
        locations = [
            ('123 Main Street, Nairobi', '456 Oak Avenue, Westlands', 12.5),
            ('789 Park Road, Kilimani', '321 Valley Drive, Karen', 8.2),
            ('111 First Ave, CBD', '222 Second St, Parklands', 6.8),
            ('555 Hill Street, Lavington', '777 Beach Road, Nyali', 485.0),
            ('999 Sunset Blvd, Kileleshwa', '888 Sunrise Lane, Runda', 15.3),
        ]
        
        today = datetime.utcnow().date()
        
        for i, client in enumerate(clients):
            pickup, dropoff, distance = locations[i % len(locations)]
            mover = movers[i % len(movers)]
            
            # Create one completed booking
            completed_booking = Booking(
                booking_reference=f"BK-2026-{str(i+100).zfill(3)}",
                client_id=client.id,
                mover_id=mover.id,
                status=BookingStatus.COMPLETED,
                pickup_address=pickup,
                dropoff_address=dropoff,
                scheduled_date=today - timedelta(days=random.randint(5, 30)),
                scheduled_time=time(9, 0),
                distance_km=distance,
                total_volume=9.0 + random.uniform(-2, 4),
                base_price=distance * mover.base_price_per_km,
                labor_cost=2000,
                packing_materials_cost=1000,
                service_fee=0,
                total_price=15000 + random.randint(-2000, 5000)
            )
            db.session.add(completed_booking)
            
            # Add review for completed booking
            if i < 3:  # First 3 clients
                review = Review(
                    booking_id=completed_booking.id,
                    client_id=client.id,
                    mover_id=mover.id,
                    rating=random.choice([4, 5]),
                    comment=random.choice([
                        "Excellent service! Very professional and careful with my items.",
                        "Great team, arrived on time and finished quickly.",
                        "Smooth move, would recommend to anyone!",
                        "Professional service from start to finish."
                    ])
                )
                db.session.add(review)
            
            # Create one upcoming booking
            if i < 3:
                upcoming_booking = Booking(
                    booking_reference=f"BK-2026-{str(i).zfill(3)}",
                    client_id=client.id,
                    mover_id=movers[(i+1) % len(movers)].id,
                    status=BookingStatus.CONFIRMED,
                    pickup_address=pickup,
                    dropoff_address=dropoff,
                    scheduled_date=today + timedelta(days=random.randint(5, 20)),
                    scheduled_time=time(9, 0),
                    distance_km=distance,
                    total_volume=9.0,
                    base_price=distance * movers[(i+1) % len(movers)].base_price_per_km,
                    labor_cost=2000,
                    packing_materials_cost=1000,
                    service_fee=0,
                    total_price=15000
                )
                db.session.add(upcoming_booking)
                
                # Add status update
                status_update = BookingStatusUpdate(
                    booking_id=upcoming_booking.id,
                    status='Booking Confirmed',
                    notes='Booking created successfully',
                    updated_by=client.id
                )
                db.session.add(status_update)
        
        db.session.commit()
        
        print("✅ Database seeded successfully!")
        print("\n📊 Summary:")
        print(f"   - Users: {User.query.count()}")
        print(f"   - Movers (Approved): {Mover.query.filter_by(is_approved=True).count()}")
        print(f"   - Movers (Pending): {Mover.query.filter_by(is_approved=False).count()}")
        print(f"   - Bookings: {Booking.query.count()}")
        print(f"   - Reviews: {Review.query.count()}")
        print(f"   - Inventory Templates: {InventoryTemplate.query.count()}")
        print("\n🔑 Login Credentials:")
        print("   Admin: admin@smartmove.com / admin123")
        print("   Client: john@example.com / password123")
        print("   Mover: contact@swiftmovers.co.ke / mover123")

if __name__ == '__main__':
    seed_database()
