from flask import Flask
import flask
import client
from client import app
from firebase import firebase

db_cursor = firebase.FirebaseApplication('https://productivity-fd14a.firebaseio.com/',None)

@client.app.route("/")
def index():
    context = {
        'username_exists': False,
        'username': ''
    }
    if "username" in flask.session.keys():
        context['username'] = flask.session['username']
        context['username_exists'] = True
    return flask.render_template("index.html", **context)

@client.app.route("/login", methods=['GET', 'POST'])
def login():
    flask.session.clear()
    context = {'error_login': False}
    if flask.request.method == 'GET':
        if "username" not in flask.session.keys():
            return flask.render_template("login.html", **context)
        return flask.redirect("/")
    top_level = db_cursor.get('/',None)
    username = flask.request.form['username']
    password = flask.request.form['password']
    if username in top_level['users'] and top_level['users'][username] == password:
        flask.session['username'] = username
        return flask.redirect("/")
    else:
        context['error_login'] = True
        return flask.render_template("login.html", **context)


@client.app.route("/signup", methods=['POST'])
def signup():
    username = flask.request.form['username']
    password = flask.request.form['password']
    top_level = db_cursor.get('/',None)
    if not username or not password or username in top_level['users']:
        context = {'error_signup': True}
        return flask.render_template("login.html", **context)
    db_cursor.put('/users',username , password)
    flask.session['username'] = username
    return flask.redirect("/")

@client.app.route("/logout")
def logout():
    flask.session.clear()
    return flask.redirect("/")