from flask.wtf import flask_wtf,Form, StringField, PasswordField, validators
from myapplication.models import User


class LoginForm(Form):
    email_validator = [flask_wtf.Required()]
    pwd_validator = [flask_wtf.Required(), flask_wtf.Length(2)]
    
    username = flask_wtf.StringField('Username', validators = email_validator)
    password = flask_wtf.PasswordField('Password', validators = pwd_validator)
    submit = flask_wtf.SubmitField("Login")

    def _get_user(self, username):
        return db.users.find_one({'username': username})

    def validate_email(self, field):
        if not self._get_user(field.data):
            raise flask_wtf.ValidationError("Please enter a valid email")

    def validate_password(self, field):
        user = self._get_user(self.email.data)
        if user and user[u'password'] != field.data:
            raise flask_wtf.ValidationError("Please enter a valid pssword")