from flask import render_template_string
from flask_security import auth_required, current_user, roles_required

def create_view(app):

    @app.route('/')
    def home():
        return render_template_string(
            """
            <h1> this is the header </h1>
            <div><a href="/login">login </a></div>
            <a href="/profile">profile </a>
            """


        )

    @app.route('/profile')
    @auth_required('session', 'token')

    def profile():
        return render_template_string(
            """
            <h1> This is the profile page</h1>
            <p> Welcome, {{current_user.email}}
            <a href="/logout">Logout </a>
            """
        )
    @app.route('/inst-dashboard')
    @roles_required('inst')

    def inst_dashboard():
        return render_template_string(
            """
            <h1> This is the Instructor Dashboard</h1>
            <p> Welcome, {{current_user.email}}
            <a href="/logout">Logout </a>
            """
        )
