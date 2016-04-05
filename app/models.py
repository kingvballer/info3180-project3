from . import db

class User(db.Model):
    userid = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String(255))
    firstname = db.Column(db.String(80))
    lastname = db.Column(db.String(120))
    age = db.Column(db.String(3))
    sex = db.Column(db.String(10))
    email = db.Column(db.String(35))
    password = db.Column(db.String(35))

    def __init__(self, firstname, lastname, age, sex, email, password):
        
        self.firstname = firstname
        self.lastname = lastname
        self.age = age
        self.sex = sex
        self.email = email
        self.password = password
        
    def is_authenticated(self):
        return True
        
        
    def is_active(self):
        return True
        
        
    def is_anonymous(self):
        return False
        
        
    def get_id(self):
        return unicode(self.userid)
        
    def __repr__(self):
        return '<User %r>' % self.email 
        
class mywishList(db.Model):
    wishid = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.userid'))
    title = db.Column(db.String(100))
    description = db.Column(db.String(500))
    description_url = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    
    
    def __init__(self, userid, title, description, description_url, image_url):
        self.userid = userid
        self.title = title
        self.description = description
        self.description_url = description_url
        self.image_url = image_url
        
    

    def __repr__(self):
        return '<User %r>' % self.username
        
        
