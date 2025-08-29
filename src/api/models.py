from enum import Enum
from decimal import Decimal
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

# =============================================================================
# Tablas de asociación (muchos-a-muchos)
# =============================================================================

user_roles = db.Table(
    "user_roles",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)

tour_categories = db.Table(
    "tour_categories",
    db.Column("tour_id", db.Integer, db.ForeignKey("tour.id"), primary_key=True),
    db.Column("category_id", db.Integer, db.ForeignKey("category.id"), primary_key=True),
)

tour_images = db.Table(
    "tour_images",
    db.Column("tour_id", db.Integer, db.ForeignKey("tour.id"), primary_key=True),
    db.Column("image_id", db.Integer, db.ForeignKey("image.id"), primary_key=True),
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

#-------------------------------------------------------------------------------------------------------------


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

    tours = db.relationship("Tour", backref="country", lazy=True)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "tours": [t.id for t in (self.tours or [])],
        }

# ------------------------------ CATEGORY -------------------------------------

class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)

    def serialize(self) -> dict:
        return {"id": self.id, "name": self.name}

# ------------------------------ IMAGE ----------------------------------------

class Image(db.Model):
    __tablename__ = "image"

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=False)

    def serialize(self) -> dict:
        return {"id": self.id, "url": self.url}

# ------------------------------ TOUR -----------------------------------------

class Tour(db.Model):
    __tablename__ = "tour"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    country_id = db.Column(db.Integer, db.ForeignKey("country.id"), nullable=False)

    schedules = db.relationship(
        "TourSchedule", backref="tour", lazy=True, cascade="all, delete-orphan"
    )
    reviews = db.relationship(
        "Review", backref="tour", lazy=True, cascade="all, delete-orphan"
    )
    bookings = db.relationship("Booking", backref="tour", lazy=True)

    categories = db.relationship(
        "Category", secondary=tour_categories, backref="tours", lazy="dynamic"
    )
    images = db.relationship(
        "Image", secondary=tour_images, backref="tours", lazy="dynamic"
    )

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "city": self.city,
            "base_price": str(self.base_price),
            "country_id": self.country_id,
            "user_id": self.user_id,
            "categories": [c.name for c in self.categories] if self.categories else [],
            "images": [img.url for img in self.images] if self.images else [],
        }

# ------------------------------ TOUR SCHEDULE --------------------------------

class TourSchedule(db.Model):
    __tablename__ = "tour_schedule"

    id = db.Column(db.Integer, primary_key=True)
    tour_date = db.Column(db.Date, nullable=False)
    available_slots = db.Column(db.Integer, nullable=False)

    tour_id = db.Column(db.Integer, db.ForeignKey("tour.id"), nullable=False)

    bookings = db.relationship("Booking", backref="schedule", lazy=True)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "tour_date": self.tour_date.isoformat() if self.tour_date else None,
            "available_slots": self.available_slots,
            "tour_id": self.tour_id,
        }

# ------------------------------ BOOKING --------------------------------------

class Booking(db.Model):
    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True)
    num_guests = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tour_id = db.Column(db.Integer, db.ForeignKey("tour.id"), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey("tour_schedule.id"), nullable=False)

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "num_guests": self.num_guests,
            "total_price": str(self.total_price),
            "status": self.status,
            "user_id": self.user_id,
            "tour_id": self.tour_id,
            "schedule_id": self.schedule_id,
        }

# ------------------------------ REVIEW ---------------------------------------

class Review(db.Model):
    __tablename__ = "review"

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Numeric(2, 1), nullable=False)  # 0.0 .. 5.0

    tour_id = db.Column(db.Integer, db.ForeignKey("tour.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    @validates("rating")
    def validate_rating(self, key, rating):
        if rating is None:
            raise ValueError("La calificación no puede ser nula.")
        if isinstance(rating, Decimal):
            val = rating
        elif isinstance(rating, (int, float)):
            val = Decimal(str(rating))
        elif isinstance(rating, str):
            val = Decimal(rating)
        else:
            raise ValueError("La calificación debe ser numérica.")
        if not (Decimal("0.0") <= val <= Decimal("5.0")):
            raise ValueError("La calificación debe estar entre 0 y 5.")
        return val.quantize(Decimal("0.0"))

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "comment": self.comment,
            "rating": float(self.rating) if self.rating is not None else None,
            "tour_id": self.tour_id,
            "user_id": self.user_id,
        }
