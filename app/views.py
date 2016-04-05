"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/

This file creates your application.
"""

from app import db, app
from app.models import User, mywishList
from flask import render_template, request, redirect, url_for, flash, jsonify, send_from_directory, g, session
from .forms import userForm, Login, Register, WishForm
from werkzeug import secure_filename
from flask.ext.login import LoginManager, login_user , logout_user , current_user , login_required
from sqlalchemy.sql import functions
from random import randint
from functools import wraps
from bs4 import BeautifulSoup
import requests

import os
import json
import random



###
# Routing for your application.
###

app.secret_key = 'Who is that pokemon?'
app.config.from_object(__name__)


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
    

@app.before_request
def before_request():
    g.user = current_user
    

@app.route('/api/user/login', methods=['POST','GET'])
def login():
    error=None
    form = Login(request.form)
    if request.method == 'POST':
        attempted_email = request.form['email']
        attempted_password = request.form['password']
        db_creds = User.query.filter_by(email=attempted_email).first()
        db_email = db_creds.email
        db_password = db_creds.password
        db_id = db_creds.userid
        if attempted_email == db_email and attempted_password == db_password:
            session['logged_in'] = True
            login_user(db_creds)
            return redirect('/api/user/'+str(db_id))
        else:
            error = 'Invalid credentials'
            return render_template("login.html",error=error,form=form)
    form = Login()
    return render_template("login.html",error=error,form=form)


@app.route('/logout')
def logout():
    logout_user()
    session['logged_in'] = False
    return redirect('/api/user/login')


@app.route('/api/user/register', methods = ['POST','GET'])
def newprofile():
    if request.method == 'POST':
        form = userForm()
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        sex = request.form['sex']
        age = int(request.form['age'])
        email = request.form['email']
        password = request.form['password']
        newProfile =User(firstname=firstname, lastname=lastname, email=email, password=password, sex=sex, age=age)
        db.session.add(newProfile)
        db.session.commit()
        profilefilter = User.query.filter_by(email=newProfile.email).first()
        return redirect('/api/user/'+str(profilefilter.userid))
    form = userForm()
    return render_template('register.html',form=form)


@app.route('/api/user/<userid>')
@login_required
def profile_view(userid):
    if g.user.is_authenticated:
        profile_vars = {'id':g.user.userid, 'email':g.user.email, 'age':g.user.age, 'firstname':g.user.firstname, 'lastname':g.user.lastname, 'sex':g.user.sex}
        return render_template('welcome.html',profile=profile_vars)
    

@app.route('/api/user/<id>/wishlist', methods = ['POST','GET'])
@login_required
def wishlist(id):
    profile = User.query.filter_by(userid=id).first()
    profile_vars = {'id':profile.userid, 'email':profile.email, 'age':profile.age, 'firstname':profile.firstname, 'lastname':profile.lastname, 'sex':profile.sex}
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        description_url = request.form['url']
        image_url = request.form['image_url']
        newWish = mywishList(userid=id, title=title, description=description, description_url=description_url, image_url=image_url)
        db.session.add(newWish)
        db.session.commit()
        profilefilter = mywishList.query.filter_by(wishid=newWish.wishid).first()
        return redirect(url_for('getPics',wishid=profilefilter.wishid))
    form = WishForm()
    return render_template('addtowishlist.html',form=form,profile=profile_vars)
    
    
@app.route('/api/user/<id>/wishlists', methods=('GET', 'POST'))
def wishlists(id):
    wishlists = mywishList.query.all()
    storage = []
    for wishes in wishlists:
        storage.append({'title':wishes.title, 'description':wishes.description, 'url':wishes.description_url, 'image_url':wishes.image_url})
    
    wishes = {'wishes': storage}
    
    if request.method == 'POST':
      return jsonify(wishes)
    else:
      return render_template('viewlistwish.html',wishlists=storage)  
    
    
@app.route('/api/thumbnail/process/<wishid>')
@login_required
def getPics(wishid):
    profilefilter = mywishList.query.filter_by(wishid=wishid).first()
    url = profilefilter.description_url
    result = requests.get(url)
    data = result.text
    images = []
    soup = BeautifulSoup(data, 'html.parser')
    og_image = (soup.find('meta', property='og:image') or soup.find('meta', attrs={'name': 'og:image'}))
    if og_image and og_image['content']:
        images.append(og_image['content'])
    for img in soup.find_all("img", class_="a-dynamic-image"):
        print img['src']
        images.append(img['src'])
    thumbnail_spec = soup.find('link', rel='image_src')
    if thumbnail_spec and thumbnail_spec['href']:
        images.append(thumbnail_spec['href'])
    for img in soup.find_all("img", class_="a-dynamic-image"):
        if "sprite" not in img["src"]:
            images.append(img['src'])
    return render_template('thumbnails.html',images=images)
    
    


@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')
    



###
# The functions below should be applicable to all Flask apps.
###


@app.route('/profile/', methods=('GET', 'POST'))
def profile():
    form = userForm()
    userid = random.randint(63000000, 63999999)
    print 'test'
    if request.method == 'POST': # and form.validate_on_submit():
        print 'validated'
        firstname = request.form['firstname']
        lastname = request.form['lastname']
        age = request.form['age']
        sex = request.form['sex']
        file = request.files['image']
        image = secure_filename(file.filename)
        file.save(os.path.join("pics",image))
        user = User(userid, image, firstname, lastname, age, sex)
        db.session.add(user)
        db.session.commit()
        flash('File Uploaded successfully')
        return redirect(url_for('profile'))
    return render_template('profile.html', form=form)
    
    
    
@app.route('/profiles/', methods=('GET', 'POST'))
def profiles():
    profiles = User.query.all()
    storage = []
    if request.method == 'POST':
      for users in profiles:
        storage.append({'userid':users.userid, 'firstname':users.firstname, 'lastname':users.lastname, 'sex':users.sex, 'age':users.age, 'image' :users.image, 'email':users.email, 'password':users.password})
      users = {'users': storage}
      return jsonify(users)
    else:
      return render_template('profiles.html',profiles=profiles)  
    
@app.route('/profile/<userid>', methods=('GET', 'POST'))
def show_user(userid):
    user = User.query.filter_by(userid=userid).first_or_404()
    return render_template('profiles.html', user=user)
    

@app.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory(os.path.dirname(os.path.abspath(__file__)) + '/../pics/',
                               filename)


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=600'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port="8888")