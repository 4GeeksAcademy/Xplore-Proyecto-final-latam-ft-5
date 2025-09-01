from enum import Enum
from decimal import Decimal
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import JSON
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

# =============================================================================
# Tablas de asociación (muchos-a-muchos)
# =============================================================================

user_roles = db.Table(
    "user_roles",
    db.Column("user_id", db.Integer, db.ForeignKey(
        "users.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey(
        "role.id"), primary_key=True),
)

# =============================================================================
# Enumeraciones
# =============================================================================


class UserRole(Enum):
    ADMIN = "ADMIN"
    PROVIDER = "PROVIDER"
    TRAVELER = "TRAVELER"

# =============================================================================
# Modelos principales
# =============================================================================

# ------------------------------ USERS ------------NO TOCAR----------------------------


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

    # coincide con tu DB
    password_hash = db.Column(db.String(255), nullable=False)

    name = db.Column(db.String(120), nullable=True)
    last_name = db.Column(db.String(120), nullable=True)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    def set_password(self, raw: str) -> None:
        self.password_hash = bcrypt.generate_password_hash(raw).decode("utf-8")

    def check_password(self, raw: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, raw)

    def serialize(self) -> dict:
        # devolvemos un "role" lógico para no romper el front
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "role": "traveler",
            "is_active": self.is_active,
        }

# -------------------------------------------------------------------------------------------------------------


# ------------------------------ ROLE -----------------------------------------

class Role(db.Model):
    __tablename__ = "role"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def serialize(self) -> dict:
        return {"id": self.id, "name": self.name}

# ------------------------------ COUNTRY --------------------------------------


class Country(db.Model):
    __tablename__ = "country"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
        }

# ------------------------------ CATEGORY -------------------------------------


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def serialize(self) -> dict:
        return {"id": self.id, "name": self.name}

# ------------------------------ TOUR -----------------------------------------


class Tour(db.Model):
    __tablename__ = "tours"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.Text, nullable=False)
    popular = db.Column(JSON, default=list)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    rate = db.Column(db.Float, default=0.0)
    tour_includes = db.Column(JSON, default=list)
    tour_not_includes = db.Column(JSON, default=list)
    duration = db.Column(db.String(120), nullable=True)
    reviews = db.relationship(
        "Review", backref="tour", lazy=True, cascade="all, delete-orphan"
    )
    images = db.Column(JSON, default=list)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "popular": self.popular,
            "base_price": self.base_price,
            "rate": self.rate,
            "tour_includes": self.tour_includes,
            "tour_not_includes":  self.tour_not_includes,
            "duration": self.duration,
            "reviews": [r.serialize() for r in self.reviews],
            "images": self.images,
        }

# ------------------------------ REVIEW ---------------------------------------


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)

    # Relación con Tour
    tour_id = db.Column(db.Integer, db.ForeignKey("tours.id"), nullable=False)

    # (opcional) relación con User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    rating = db.Column(db.Float, nullable=False)  # ej: 4.5
    comment = db.Column(db.Text, nullable=True)
    user = db.relationship("User", backref="reviews",
                           lazy=True)  # relación con User

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "tour_id": self.tour_id,
            "user_id": self.user_id,
            "user_name": self.user.name if self.user else "Anónimo",
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat()
        }
