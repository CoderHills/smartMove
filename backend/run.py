import os
from app import create_app, db
from app.models import User, Mover, Booking, InventoryTemplate

app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Make database models available in Flask shell"""
    return {
        'db': db,
        'User': User,
        'Mover': Mover,
        'Booking': Booking,
        'InventoryTemplate': InventoryTemplate
    }

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    app.run(host=host, port=port, debug=True)
