from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import enum

db = SQLAlchemy()
bcrypt = Bcrypt()

class UserRole(enum.Enum):
    TRAVELER = 'traveler'
    PROVIDER = 'provider'

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)

    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TRAVELER)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password: str):
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "role": self.role.value if self.role else None,
            "is_active": self.is_active,
        }
