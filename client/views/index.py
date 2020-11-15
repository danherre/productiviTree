from flask import Flask
import flask
import client
from client import app
# import firebase_admin
# from firebase_admin import credentials
# import hashlib

# cred = credentials.Certificate("../../../productivity-4f011-firebase-adminsdk-hb93o-3cc61cbc19.json")
# firebase_admin.initialize_app(cred)


@client.app.route("/")
def index():
    return flask.render_template("index.html")

@client.app.route("/login", methods=['GET', 'POST'])
def login():
    if flask.request.method == 'GET':
        if "user_name" not in flask.session.keys():
            return flask.render_template("login.html")
        return flask.redirect("/")
    # post method
    password = flask.request.form['password']
    algorithm = 'sha512'

    connection = insta485.model.get_db()

    # Query database to see if this user exists
    # get the username and password
    cur = connection.execute(
        "SELECT username, password FROM users WHERE username"
        " = ?",
        [flask.request.form['username']]
    )
    user = cur.fetchone()
    # if user doesn't exist, abort
    if not user:
        flask.abort(403)
    # vlog_request = user[0]+erify the login info
    new_salt = user['password'].split('$')[1]
    hash_obj = hashlib.new(algorithm)
    password_salted = new_salt + password
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, new_salt, password_hash])
    # abort if the password is wrong
    if str(user['password']) != str(password_db_string):
        flask.abort(403)
    # modify the session username
    flask.session['user_name'] = user['username']
    return flask.redirect("/")