from app.main import bp
from app.extensions import mongo
from flask import render_template, request, redirect, url_for, flash
#####test####

db = mongo.client.get_database("GaiaDB")
users = db.get_collection("admins")

@bp.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users.insert_one({"email":email, "password":password})
        if user:
            # Log successful login or redirect to home page
            return render_template('HomePage.html')
        else:
            # Log unsuccessful login and flash a message
            flash('Invalid mail or password')
            print("Failed login attempt with email:\n" ,email)
            print("and password:", password)  
    return render_template('LoginPage.html')


@bp.route('/Main')
def Main():
    # flash('You have been logged out.')
    # return redirect(url_for('main.login'))  
    return render_template('HomePage.html')