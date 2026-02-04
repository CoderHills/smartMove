# SmartMove Backend API

A complete Flask REST API for the SmartMove moving services platform with role-based authentication, booking management, and real-time tracking.

## 🚀 Features

- **Multi-Role Authentication** (Client, Mover, Admin)
- **JWT Token-based Security**
- **Complete Booking System** with dynamic pricing
- **Inventory Management** with pre-built templates
- **Real-time Move Tracking**
- **Admin Dashboard** with analytics
- **Mover Profile Management**
- **Review & Rating System**
- **PostgreSQL Database** with SQLAlchemy ORM

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## 🔧 Installation

### 1. Clone and Setup

```bash
cd smartmove-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Database

**Option A: Local PostgreSQL**

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE smartmove_db;
```

**Option B: Use Docker**
```bash
docker run --name smartmove-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smartmove_db \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/smartmove_db
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
FRONTEND_URL=http://localhost:5173
```

### 5. Initialize Database

```bash
# Create tables
flask db upgrade

# Or use Python shell
python
>>> from app import create_app, db
>>> app = create_app()
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### 6. Seed Database with Sample Data

```bash
python seed_data/seed.py
```

This will create:
- 1 Admin user
- 5 Sample clients
- 4 Approved movers (Swift Movers Ltd, Premium Relocations, etc.)
- 3 Pending movers (for admin approval)
- Inventory templates for all room types
- Sample bookings and reviews

### 7. Run the Server

```bash
python run.py
```

Server will start at `http://localhost:5000`

## 🔐 Test Credentials

After seeding, use these credentials:

| Role   | Email                          | Password    |
|--------|--------------------------------|-------------|
| Admin  | admin@smartmove.com            | admin123    |
| Client | john@example.com               | password123 |
| Mover  | contact@swiftmovers.co.ke      | mover123    |

## 📡 API Endpoints

### Authentication (`/api/auth`)

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (requires JWT)
POST   /api/auth/logout      - Logout (client-side token removal)
```

### Client Dashboard (`/api/client`)

```
GET    /api/client/dashboard  - Get client dashboard data (requires JWT, client role)
```

### Mover Dashboard (`/api/mover`)

```
GET    /api/mover/dashboard   - Get mover dashboard stats (requires JWT, mover role)
GET    /api/mover/jobs        - Get all mover jobs (requires JWT, mover role)
GET    /api/mover/profile     - Get mover profile (requires JWT, mover role)
```

### Admin Dashboard (`/api/admin`)

```
GET    /api/admin/dashboard              - Get admin dashboard (requires JWT, admin role)
GET    /api/admin/movers/pending         - Get pending movers (requires JWT, admin role)
POST   /api/admin/movers/:id/approve     - Approve mover (requires JWT, admin role)
POST   /api/admin/movers/:id/reject      - Reject mover (requires JWT, admin role)
GET    /api/admin/users                  - Get all users (requires JWT, admin role)
GET    /api/admin/bookings               - Get all bookings (requires JWT, admin role)
```

### Bookings (`/api/bookings`)

```
GET    /api/bookings/movers              - Get all available movers
POST   /api/bookings/estimate            - Calculate price estimate (requires JWT)
POST   /api/bookings                     - Create booking (requires JWT, client role)
GET    /api/bookings/:id                 - Get booking details (requires JWT)
GET    /api/bookings/:id/tracking        - Get tracking info (requires JWT)
PUT    /api/bookings/:id/status          - Update status (requires JWT, mover role)
```

### Inventory (`/api/inventory`)

```
GET    /api/inventory/templates          - Get inventory templates
POST   /api/inventory                    - Create inventory (requires JWT)
GET    /api/inventory/my-inventories     - Get user inventories (requires JWT)
GET    /api/inventory/:id                - Get specific inventory (requires JWT)
PUT    /api/inventory/:id                - Update inventory (requires JWT)
DELETE /api/inventory/:id                - Delete inventory (requires JWT)
```

## 🧪 Testing API with cURL

### Register Client
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone_number": "+254 700 999 888",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Dashboard (with JWT token)
```bash
curl -X GET http://localhost:5000/api/client/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Available Movers
```bash
curl -X GET http://localhost:5000/api/bookings/movers
```

## 🗄️ Database Schema

### Main Tables

- **users** - All platform users (clients, movers, admins)
- **movers** - Extended mover profiles
- **bookings** - Move bookings with pricing
- **inventory_templates** - Pre-built room templates
- **user_inventories** - User saved inventories
- **inventory_items** - Individual inventory items
- **reviews** - Client reviews for movers
- **booking_status_updates** - Tracking history

## 🔒 Security Features

- **Password Hashing** with bcrypt
- **JWT Token Authentication**
- **Role-Based Access Control** (RBAC)
- **Input Validation**
- **SQL Injection Protection** (SQLAlchemy ORM)
- **CORS Configuration** for frontend

## 🏗️ Project Structure

```
smartmove-backend/
├── app/
│   ├── __init__.py          # App factory
│   ├── models/              # Database models
│   │   ├── user.py
│   │   ├── mover.py
│   │   ├── booking.py
│   │   └── inventory.py
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── client.py
│   │   ├── mover.py
│   │   ├── admin.py
│   │   ├── bookings.py
│   │   └── inventory.py
│   └── utils/               # Helper functions
│       └── decorators.py
├── seed_data/               # Database seeding
│   └── seed.py
├── migrations/              # Database migrations
├── config.py                # Configuration
├── requirements.txt         # Dependencies
├── run.py                   # Entry point
└── .env                     # Environment variables
```

## 🚢 Deployment

### Using Heroku

```bash
# Install Heroku CLI
heroku create smartmove-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set JWT_SECRET_KEY=your-jwt-key
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# Deploy
git push heroku main

# Run migrations
heroku run flask db upgrade

# Seed database
heroku run python seed_data/seed.py
```

### Using DigitalOcean/AWS

1. Set up Ubuntu server
2. Install Python, PostgreSQL
3. Clone repository
4. Install dependencies
5. Configure nginx reverse proxy
6. Use gunicorn for production server
7. Set up SSL with Let's Encrypt

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Check PostgreSQL credentials

### Import Errors
- Activate virtual environment: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

### CORS Errors
- Check FRONTEND_URL in `.env` matches your React app
- Verify CORS configuration in `app/__init__.py`

### JWT Token Errors
- Ensure JWT_SECRET_KEY is set in `.env`
- Check token is included in Authorization header: `Bearer <token>`

## 📝 Development Tips

### Using Flask Shell
```bash
flask shell
>>> from app.models import User, Mover, Booking
>>> User.query.all()
>>> Mover.query.filter_by(is_approved=True).all()
```

### Database Migrations
```bash
# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade

# Rollback
flask db downgrade
```

### Adding New Endpoints
1. Create route function in appropriate blueprint
2. Add authentication decorator: `@jwt_required()`
3. Add role check: `@role_required(['client', 'admin'])`
4. Test with cURL or Postman

## 📚 Next Steps

- [ ] Integrate Google Maps API for distance calculation
- [ ] Add email notifications
- [ ] Implement real-time tracking with WebSockets
- [ ] Add payment integration (M-Pesa, Stripe)
- [ ] Add file upload for documents
- [ ] Implement search and filtering
- [ ] Add rate limiting
- [ ] Set up monitoring and logging

## 🤝 Support

For issues or questions, please check the documentation or create an issue in the repository.

## 📄 License

MIT License - see LICENSE file for details
