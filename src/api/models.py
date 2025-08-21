# src/api/models.py

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import enum

db = SQLAlchemy()
bcrypt = Bcrypt()

# 1. El Enum para validar los roles (esto es lo que faltaba)
class UserRole(enum.Enum):
    TRAVELER = 'traveler'
    PROVIDER = 'provider'

# 2. El modelo principal, ahora llamado "User"
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    # 3. La columna 'role' que faltaba
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TRAVELER)

    # 4. Los métodos para manejar la contraseña de forma segura
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role.value # Devolvemos el rol como texto
        }