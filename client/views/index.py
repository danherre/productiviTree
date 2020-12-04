from flask import Flask
import flask
import client
from client import app
from firebase import firebase


db_cursor = firebase.FirebaseApplication('https://productivity-fd14a.firebaseio.com/',None)



@client.app.route("/")
def index():
    context = {
        'name_exists': False,
        'name': '',
        'money': 1000,
        'happiness': 0,
        'numPlants': 0,
    }
    if "name" in flask.session.keys():
        top_level = db_cursor.get('/',None)
        username = flask.session['username']
        context['name'] = flask.session['name']
        context['name_exists'] = True
        context['money'] = top_level['users'][username]['money']
        context['happiness'] = top_level['users'][username]['happiness']
        context['numPlants'] = top_level['users'][username]['numPlants']
        
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
    if username in top_level['users'] and password in top_level['users'][username]['login']:
        flask.session['username'] = username
        flask.session['name'] = top_level['users'][username]['login'][password]
        return flask.redirect("/")
    else:
        context['error_login'] = True
        return flask.render_template("login.html", **context)

@client.app.route("/signup", methods=['POST'])
def signup():
    username = flask.request.form['username']
    password = flask.request.form['password']
    name = flask.request.form['name']
    top_level = db_cursor.get('/',None)
    if not username or not password or username in top_level['users']:
        context = {'error_signup': True}
        return flask.render_template("login.html", **context)
    db_cursor.put('/users', username , {'login': {password: name}, 'money': 1000, 'happiness': 0, 'numPlants': 0})
    flask.session['username'] = username
    flask.session['name'] = name
    return flask.redirect("/")

@client.app.route("/logout", methods=['POST'])
def logout():
    numPlants = int(flask.request.form['numPlants'])
    happiness = int(flask.request.form['happiness'])
    moneyDB = int(flask.request.form['moneyDB'])
    print(numPlants, happiness, moneyDB)
    user_level = db_cursor.get('/users/' + flask.session['username'], None)
    db_cursor.put('/users/' + flask.session['username'],"numPlants",numPlants) 
    db_cursor.put('/users/' + flask.session['username'],"happiness", happiness) 
    db_cursor.put('/users/' + flask.session['username'],"money", moneyDB) 
    flask.session.clear()
    return flask.redirect("/")
