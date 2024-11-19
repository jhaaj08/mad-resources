from flask import render_template, request, jsonify, render_template_string, send_file
from flask_security import auth_required, current_user, roles_required, SQLAlchemyUserDatastore, roles_accepted
from flask_security.utils import hash_password, verify_password
from extensions import db
from models import StudyResource
import datetime
from tasks import add, create_csv
from celery.result import AsyncResult

def create_view(app, user_datastore : SQLAlchemyUserDatastore, cache):

    @app.route('/start')
    def start_export():
        task = create_csv.delay()
        return jsonify({'task_id': task.id})

    @app.route('/random')
    def random_export():
        task = "random"
        return jsonify({'task_id': task})
    
    @app.route('/get-csv/<task_id>')
    def get_csv(task_id):
        result = AsyncResult(task_id)

        if result.ready():
            return send_file('./user-files/file.csv')
        else:
            return "task not ready", 405


    #celerydemo
    @app.route('/celerydemo')
    def celery_demo():
        task = add.delay(10, 20)
        if task:
            print(f"Task created with ID: {task.id}")
            return jsonify({'task_id': task.id})
        else:
            return jsonify({'message': 'Task creation failed'}), 500
    

    @app.route('/get-task/<task_id>')
    def get_task(task_id):
        # Assuming your Celery app is initialized as 'celery_app' in app.py
        task_result = AsyncResult(task_id, app=app.extensions["celery"])

        # Check the state of the task
        if task_result.state == 'PENDING':
            return jsonify({'state': 'PENDING'}), 202
        elif task_result.state == 'SUCCESS':
            return jsonify({'state': 'SUCCESS', 'result': task_result.result}), 200
        elif task_result.state == 'FAILURE':
            return jsonify({'state': 'FAILURE', 'error': str(task_result.info)}), 500
        else:
            return jsonify({'state': task_result.state}), 200

        
    #cache demo 
    @app.route('/cachedemo')
    @cache.cached(timeout=50)
    def cacheDemo():
        return {"time": datetime.datetime.now()}

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

    @app.route('/verify-resource/<id>')
    @roles_required('inst')
    def activate_resource(id):
        resource = StudyResource.query.get(id)
        resource.is_approved = True
        db.session.commit()
        if not resource:
            return jsonify({'message': 'no such resource'}),400
        return jsonify({'message': 'resource got', 'resource' : resource.content}),200

    @app.route('/inactive-inst-list', methods =['GET'])
    @roles_accepted('admin')
    def get_inactive_instructors():
        all_users=user_datastore.user_model().query.all()
    
        inactive_instructors = [
            user for user in all_users
            if not user.active and any(role.name == 'inst' for role in user.roles)
        ]

        results = [
            {
                'id' : user.id,
                'email' : user.email,
            }
            for user in inactive_instructors
        ]

        return jsonify(results), 200