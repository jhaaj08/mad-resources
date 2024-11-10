from flask import render_template, request, jsonify
from flask_security import auth_required, current_user, roles_required, SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from extensions import db

def create_view(app, user_datastore : SQLAlchemyUserDatastore):

    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not email or not password or not role:
            return jsonify({"message": "invalid input"})
        if user_datastore.find_user(email = email):
            return jsonify({"message": "user already exists"})
        
        if role == "inst":
            active = False
        elif role == "stud":
            active = True
        try:
            user_datastore.create_user(email = email, password = hash_password(password), roles=[role],active=active)
            db.session.commit()
        except:
            print("error while creating")
            db.session.rollback()
            return jsonify({'message':'error in user creation'}), 408
        return jsonify({'message':'user_created'}),200