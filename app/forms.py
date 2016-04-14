from flask.ext.wtf import Form
from wtforms.fields import TextField, FileField, IntegerField, SubmitField, SelectField, PasswordField
from wtforms.validators import Required, ValidationError, DataRequired,Email,Length
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import validators

class userForm(Form):
    firstname = TextField('FirstName', validators = [Required()])
    lastname = TextField('LastName', validators = [Required()])
    age = TextField('Age', validators = [Required()])
    sex = SelectField('Sex', validators = [Required()], choices = [('M', 'Male'),('F', 'Female')])
    image = FileField('image', validators=[FileRequired(), FileAllowed(['jpg', 'png'], 'Images only!')])
    email = TextField('Email Address', validators=[Length(min=6, max=100), Required("Required"), Email()])
    password = PasswordField('Password', validators=[Required("Required"), Length(min=4, max=100)])
    #submit = SubmitField('Submit')
    
class Login(Form):
      email = TextField('Email Address', validators=[validators.DataRequired('** email required **'), validators.Email('** invalid email **')])
      password = PasswordField('Password', [validators.Required('** password required **')])
      
class Register(Form):
      email = TextField('Email Address', validators=[validators.DataRequired('** email required **'), validators.Email('** invalid email **')])
      password = PasswordField('Password', [validators.Required('** password required **'), validators.EqualTo('confirm', message='** passwords must match **')])
      confirm = PasswordField('Confirm Password')
      
class WishForm(Form):
    title = TextField('Title')
    description = TextField('Description')
    description_url = TextField('Reference')
    image_url = TextField('ImageUrl')