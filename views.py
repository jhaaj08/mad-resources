from flask import render_template
from flask_security import auth_required, current_user, roles_required

def create_view(app):

    @app.route('/')
    def home():
        return render_template('index.html')
