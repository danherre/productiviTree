from flask import Flask
import flask
import client
from client import app

@client.app.route("/")
def index():
    return flask.render_template("index.html")