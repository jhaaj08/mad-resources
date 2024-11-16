from flask import render_template, request, jsonify, render_template_string
from flask_security import auth_required, current_user, roles_required, SQLAlchemyUserDatastore, roles_accepted
from flask_security.utils import hash_password, verify_password
from extensions import db

def create_view(app, user_datastore : SQLAlchemyUserDatastore):

    @app.route('/')
    def home():
        return render_template('index.html')
    
    @app.route('/user-login', methods=['POST'])
    def user_login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message' : 'email or password not provided'}), 400
        
        user = user_datastore.find_user(email = email)

        if not user:
            return jsonify({'message' : 'invalid user'}), 400
        
        if verify_password(password, user.password):
            return jsonify({'token' : user.get_auth_token(), 'user' : user.email, 'role' : user.roles[0].name}), 200
        else :
            return jsonify({'message' : 'invalid password'}), 400

    @app.route('/profile')
    @auth_required('token')
    def profile():
        return render_template_string(
            """
            <h1> This is a profile page </h1>
            <p> Welcome, {{current_user.email}}
            <a href="/logout">logout</a>
            """
        )
    
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
    
    @app.route('/activate-inst/<id>', methods=['GET'])
    @roles_accepted('admin')
    def activate_inst(id):
        user = user_datastore.find_user(id=id)
        if not user:
            return jsonify({'message': 'user not present'}), 400

        #check if instructor is already activated 
        if (user.active == True):
            return jsonify({'message': 'user already active'}), 400


        user.active = True
        db.session.commit()
        return jsonify({'message': 'user has been activated'})

