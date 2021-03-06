from flask import Flask
import flask
import os
from firebase import firebase
app = Flask(__name__)
app.secret_key = '\x0cQQ\xe5\x80\x1e\xad\xf2N\xb4\xdc\xcb\xad\x94q\xcd}\xdb\xfa TV\x98\xe8'
db_cursor = firebase.FirebaseApplication('https://productivity-fd14a.firebaseio.com/',None)



@app.route("/")
def index():
    context = {
        'name_exists': False,
        'long_name': False,
        'name': '',
        'username': '',
    }
    if "name" in flask.session.keys():
        top_level = db_cursor.get('/',None)
        username = flask.session['username']
        context['username'] = username
        context['name'] = flask.session['name']
        context['name_exists'] = True
        if len(flask.session['name']) > 10:
            context['long_name'] = True
        
    return flask.render_template("index.html", **context)

@app.route("/login", methods=['GET', 'POST'])
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

@app.route("/signup", methods=['POST'])
def signup():
    username = flask.request.form['username']
    password = flask.request.form['password']
    name = flask.request.form['name']
    top_level = db_cursor.get('/',None)
    if not username or not password or username in top_level['users']:
        context = {'error_signup': True}
        return flask.render_template("login.html", **context)
    db_cursor.put('/users', username , {'login': {password: name}, 'money': 25, 'happiness': 0, 'numPlants': 0})
    flask.session['username'] = username
    flask.session['name'] = name
    return flask.redirect("/")

@app.route("/logout")
def logout():
    flask.session.clear()
    return flask.redirect("/")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)