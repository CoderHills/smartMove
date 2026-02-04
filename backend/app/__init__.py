from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import config
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5175",
                "http://127.0.0.1:5175",
                "http://localhost:5176",
                "http://127.0.0.1:5176",
                "http://localhost:3000",
                "http://127.0.0.1:3000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register blueprints
    from app.routes import auth, client, mover, admin, bookings, inventory
    
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(client.bp, url_prefix='/api/client')
    app.register_blueprint(mover.bp, url_prefix='/api/mover')
    app.register_blueprint(admin.bp, url_prefix='/api/admin')
    app.register_blueprint(bookings.bp, url_prefix='/api/bookings')
    app.register_blueprint(inventory.bp, url_prefix='/api/inventory')
    
    # Health check route
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'message': 'SmartMove API is running'}, 200
    
    @app.route('/')
    def index():
        return {
            'message': 'Welcome to SmartMove API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'client': '/api/client',
                'mover': '/api/mover',
                'admin': '/api/admin',
                'bookings': '/api/bookings',
                'inventory': '/api/inventory'
            }
        }, 200
    
    return app
